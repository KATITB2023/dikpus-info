import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const metricsRouter = createTRPCRouter({
  getJSON: publicProcedure.query(async ({ ctx }) => {
    // Await is not required in TRPC, but you can use it if you want
    return await ctx.prisma.$metrics.json();
  }),
  getPrometheus: publicProcedure.query(async ({ ctx }) => {
    // Await is not required in TRPC, but you can use it if you want
    return await ctx.prisma.$metrics.prometheus();
  }),
});
