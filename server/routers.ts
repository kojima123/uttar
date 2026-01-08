import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { addSharedRecord, getSharedRecords } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Shared timeline router
  shared: router({
    // Get latest 30 shared records
    list: publicProcedure.query(async () => {
      return await getSharedRecords();
    }),
    // Add a new shared record
    add: publicProcedure
      .input(
        z.object({
          nickname: z.string().min(1).max(50),
          area: z.string(),
          side: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await addSharedRecord({
          nickname: input.nickname,
          area: input.area,
          side: input.side,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
