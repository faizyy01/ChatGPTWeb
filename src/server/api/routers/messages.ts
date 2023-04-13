//This endpoint is used to get the GPT response

import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from "openai";
import { type Messages } from "~/types/message.types";
import { messagesSchema } from "~/types/message.types";
import { Role } from "@prisma/client";
import { env } from "~/env.mjs";
import { getDefaultModel } from "~/lib/models/getModels";
const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const chatRouter = createTRPCRouter({
    getMessages: protectedProcedure
        .input(z.object({
            chatId: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!input.chatId) {
                return undefined;
            }
            return await prisma.messages.findMany(
                {
                    where: {
                        userId: ctx.session.user.id,
                        chatId: input.chatId,
                    },
                }
            );
        }),
    getChats: protectedProcedure
        .input(z.object({
            limit: z.number().min(1).max(30).nullish(),
            cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
        }))
        .query(async ({ ctx, input }) => {
            const limit = input.limit ?? 30;
            const { cursor } = input;
            const chats = await prisma.chat.findMany(
                {
                    take: limit + 1, // get an extra item at the end which we'll use as next cursor
                    cursor: cursor ? { id: cursor } : undefined,
                    where: {
                        userId: ctx.session.user.id,
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },

                }
            );
            let nextCursor: typeof cursor | undefined = undefined;
            if (chats.length > limit) {
                const nextItem = chats.pop()
                nextCursor = nextItem?.id ? nextItem.id : undefined;
            }
            return {
                chats: chats,
                nextCursor: nextCursor,
            };
        }),
    getGptResponse: protectedProcedure
        .input(messagesSchema)
        .mutation(async ({ input, ctx }) => {
            // Check if the user is an admin or whitelisted
            const user = await prisma.user.findUnique({
                where: { id: ctx.session.user.id },
                select: { isAdmin: true, isWhitelisted: true },
            });
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.isAdmin && !user.isWhitelisted) {
                throw new Error("Unauthorized access. Message fez#8895 on Discord to get whitelisted.");
            }
            const { messages, chatId } = input;
            const lastMessage = messages[messages.length - 1];
            if (!messages || !lastMessage || !lastMessage.content) {
                throw new Error("messages is not defined");
            }
            const chatCompletetion = await openai.createChatCompletion(
                {
                    model: input.model,
                    messages: messages as ChatCompletionRequestMessage[],
                }
            );
            //handle response error.

            const gotResponse = chatCompletetion.data.choices[0]?.message as Messages;
            const totalTokens = chatCompletetion.data.usage?.total_tokens ? chatCompletetion.data.usage?.total_tokens : 0;
            const completionTokens = chatCompletetion.data.usage?.completion_tokens ? chatCompletetion.data.usage?.completion_tokens : 0;
            const promptTokens = chatCompletetion.data.usage?.prompt_tokens ? chatCompletetion.data.usage?.prompt_tokens : 0;
            const totalGpt3tokens = input.model === "gpt-3.5-turbo" ? totalTokens : 0;
            const totalGpt4tokens = input.model === "gpt-4" ? totalTokens : 0;

            if (chatCompletetion.status !== 200 || !gotResponse || !gotResponse.content) {
                throw new Error("GPT-3 error");
            }
            const newMessages = [
                {
                    role: Role.user,
                    content: lastMessage.content,
                    userId: ctx.session.user.id,
                },
                {
                    role: Role.system,
                    content: gotResponse.content,
                    userId: ctx.session.user.id,
                },
            ]
            if (!chatId) {
                const newChat = await prisma.chat.create({
                    data: {
                        name: lastMessage.content.split(' ').slice(0, 3).join(' '),
                        totalTokens: totalTokens,
                        totalGpt3tokens,
                        totalGpt4tokens,
                        messages: {
                            create: newMessages.map(message => ({
                                role: message.role,
                                message: message.content,
                                userId: ctx.session.user.id,
                                tokens: message.role === Role.system ? completionTokens : promptTokens,
                            }))
                        },
                        userId: ctx.session.user.id,
                    }
                });
                return { gpt: gotResponse, chat: newChat };
            }
            else {
                const lastUserMessage = messages[0];
                if (!lastUserMessage)
                    throw new Error("lastUserMessage is not defined");
                await prisma.messages.createMany({
                    data: newMessages.map(message => ({
                        role: message.role,
                        message: message.content,
                        chatId: chatId,
                        userId: ctx.session.user.id,
                        tokens: message.role === Role.system ? completionTokens : promptTokens,
                    }))
                });
                await prisma.chat.update({
                    where: { id: chatId },
                    data: {
                        totalTokens: { increment: totalTokens },
                        totalGpt3tokens: { increment: totalGpt3tokens },
                        totalGpt4tokens: { increment: totalGpt4tokens },
                    },
                });
                return { gpt: gotResponse, chat: undefined };
            }
        }),
});
