
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const settingsRouter = createTRPCRouter({
    getTokens: protectedProcedure
        .query(async ({ ctx }) => {
            return await prisma.chat.aggregate({
                _sum: {
                    totalTokens: true,
                },
                where: {
                    userId: ctx.session.user.id,
                },
            });
        }),
    getTotalTokens: protectedProcedure
        .query(async ({ ctx }) => {
            //check if user is admin
            const user = await prisma.user.findUnique({
                where: { id: ctx.session.user.id },
                select: { isAdmin: true, isWhitelisted: true },
            });
            if (!user?.isAdmin) {
                throw new Error("Not authorized");
            }
            return await prisma.chat.aggregate({
                _sum: {
                    totalTokens: true,
                },
            });
        }),
});