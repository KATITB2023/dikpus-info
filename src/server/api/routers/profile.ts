import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  studentProcedure
} from '~/server/api/trpc';
import { compare, hash } from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { env } from '~/env.mjs';

export const profileRouter = createTRPCRouter({
  getProfile: studentProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const studentData = await ctx.prisma.student.findFirst({
        where: {
          userId: input.userId
        },
        include: {
          group: {
            select: {
              id: true,
              group: true,
              zoomLink: true,
            }
          }
        }
      })
      return studentData;
    }),

  editProfile: studentProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        profile_url: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // return input
      await ctx.prisma.student.update({
        where: {
          userId: input.userId
        },
        data: {
          imagePath: input.profile_url,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber
        }
      });
      
      return {
        message: 'Edit profile successful'
      };
    }),

  changePass: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        curPass: z.string(),
        newPass: z.string(),
        repeatPass: z.string()
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

      const isValid = await compare(input.curPass, user.passwordHash);
      if (!isValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Incorrect current password'
        });
      }

      if (input.repeatPass.localeCompare(input.newPass) !== 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "Confirmation password doesn't match"
        });
      }

      const saltRounds = env.BCRYPT_SALT;

      await ctx.prisma.user.update({
        where: {
          id: input.userId
        },
        data: {
          passwordHash: await hash(input.newPass, saltRounds)
        }
      });

      return {
        message: 'Change password successful'
      };
    })
});
