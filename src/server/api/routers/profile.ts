// import { z } from "zod";
import {
  createTRPCRouter,
  // publicProcedure,
  // studentProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  // getProfile: studentProcedure
  //   .input(z.object({ userId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     // TODO
  //     // Get Profile
  //     return input.userId;
  //   }),

  // editProfile: studentProcedure
  //   .input(z.object({ userId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     // TODO
  //     // Edit Profile
  //     return input.userId;
  //   })
});
