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
        .query(async ({ ctx, input }) => {
            if (!input.chatId) {
                return undefined;
            }
            return await prisma.messages.findMany(
                {
                    where: {
                        user: ctx.session.user.id,
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
                        user: ctx.session.user.id,
                    },
                }
            );
        }),
    getGptResponse: protectedProcedure
        .input(messagesSchema)
        .mutation(async ({ input }) => {
            const messages = input;
            const chatCompletetion = await openai.createChatCompletion(
                {
                    model: "gpt-3.5-turbo",
                    messages: messages as ChatCompletionRequestMessage[],
                }
            );
            const gotResponse = chatCompletetion.data.choices[0]?.message as Messages;

            return gotResponse;
        }),
});
