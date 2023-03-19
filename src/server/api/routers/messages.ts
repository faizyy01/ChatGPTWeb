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
if (!process.env.OPENAI_API_KEY)
    throw new Error("OPENAI_API_KEY is not defined");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
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
        .query(async ({ ctx }) => {
            return await prisma.chat.findMany(
                {
                    where: {
                        userId: ctx.session.user.id,
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                }
            );
        }),
    getGptResponse: protectedProcedure
        .input(messagesSchema)
        .mutation(async ({ input, ctx }) => {
            const { messages, chatId } = input;
            if (!messages || !messages[0] || !messages[0].content) {
                throw new Error("messages is not defined");
            }
            const chatCompletetion = await openai.createChatCompletion(
                {
                    model: "gpt-3.5-turbo",
                    messages: messages as ChatCompletionRequestMessage[],
                }
            );
            const gotResponse = chatCompletetion.data.choices[0]?.message as Messages;
            const newMessages = [
                {
                    role: Role.user,
                    content: messages[0].content,
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
                        name: messages[0].content.split(' ').slice(0, 3).join(' '),
                        messages: {
                            create: newMessages.map(message => ({
                                role: message.role,
                                message: message.content,
                                userId: ctx.session.user.id,
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
                    }))
                });
                return { gpt: gotResponse, chat: undefined };
            }
        }),
});
