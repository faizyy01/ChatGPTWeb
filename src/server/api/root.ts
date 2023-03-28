import { createTRPCRouter } from "~/server/api/trpc";
import { settingsRouter } from "./routers/settings";
import { chatRouter } from "./routers/messages";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chatRouter: chatRouter,
  settingsRouter: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
