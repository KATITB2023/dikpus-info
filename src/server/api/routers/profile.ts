import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  studentProcedure
} from '~/server/api/trpc';
import { compare, hash } from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { env } from '~/env.mjs';

export const profileRouter = createTRPCRouter({
  getProfile: studentProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // TODO
      // Get Profile
      return input.userId;
    }),

  editProfile: studentProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO
      // Edit Profile
      return input.userId;
    }),

  changePass: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        cur_pass: z.string(),
        new_pass: z.string(),
        repeat_pass: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.userId
        },
        select: {
          passwordHash: true
        }
      });

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User not found'
        });
      }

      const isValid = await compare(input.cur_pass, user.passwordHash);
      if (!isValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Incorrect current password'
        });
      }

      if (input.repeat_pass.localeCompare(input.new_pass) !== 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "Confirmation password doesn't match"
        });
      }

      const saltRounds = env.BCRYPT_SALT;

      return await ctx.prisma.user.update({
        where: {
          id: input.userId
        },
        data: {
          passwordHash: await hash(input.new_pass, saltRounds)
        }
      });
    })
});
