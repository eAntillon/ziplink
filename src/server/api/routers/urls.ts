import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  rateLimitedProcedure,
} from "~/server/api/trpc";
import { urls } from "~/server/db/schema";
import { generateShortLink } from "~/utils/link";

export const urlRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: rateLimitedProcedure
    .input(z.object({ longUrl: z.string().min(8) }))
    .mutation(async ({ ctx, input }) => {
      let shortUrl = generateShortLink();
      const consult = await ctx.db.query.urls.findFirst({
        where: (urls, { eq }) => eq(urls.shortUrl, shortUrl),
      });
      if (consult) {
        shortUrl = generateShortLink();
      }
      const userId = ctx.session?.user?.id;
      return await ctx.db
        .insert(urls)
        .values({
          url: input.longUrl,
          shortUrl: shortUrl,
          userId: userId ?? null,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        })
        .returning();
    }),

  getLink: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.urls.findFirst({
        where: (urls, { eq }) => eq(urls.shortUrl, input.id),
      });
    }),

  getLinksByUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.urls.findMany({
      where: (urls, { eq }) => eq(urls.userId, ctx.session.user.id),
    });
  }),

  deleteLink: protectedProcedure
    .input(z.object({ userId: z.string().nullable(), urlId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        const url = await ctx.db.query.urls.findFirst({
          where: (urls, { eq }) => eq(urls.id, input.urlId),
        });
        if (url?.userId === null) {
          return ctx.db
            .delete(urls)
            .where(and(eq(urls.id, input.urlId)))
            .returning();
        } else {
          throw new Error("You are not authorized to delete this link");
        }
      } else {
        return ctx.db
          .delete(urls)
          .where(and(eq(urls.id, input.urlId), eq(urls.userId, input.userId ?? "")))
          .returning();
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
