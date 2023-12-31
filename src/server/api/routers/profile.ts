import { z } from "zod";
import {
  createTRPCRouter,
  mentorProcedure,
  protectedProcedure,
  studentProcedure
} from "~/server/api/trpc";
import { compare, hash } from "bcrypt";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

export const profileRouter = createTRPCRouter({
  getProfile: studentProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const studentData = await ctx.prisma.student.findFirst({
        where: {
          userId: input.userId
        },
        include: {
          user: {
            select: {
              nim: true
            }
          },
          group: {
            select: {
              id: true,
              group: true,
              zoomLink: true
            }
          }
        }
      });
      return studentData;
    }),

  editProfile: studentProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        profileURL: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.student.update({
        where: {
          userId: input.userId
        },
        data: {
          imagePath: input.profileURL,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber
        }
      });

      return {
        message: "Edit profile successful"
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
          code: "BAD_REQUEST",
          message: "User not found"
        });
      }

      const isValid = await compare(input.curPass, user.passwordHash);
      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect current password"
        });
      }

      if (input.repeatPass.localeCompare(input.newPass) !== 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Confirmation password doesn't match"
        });
      }

      await ctx.prisma.user.update({
        where: {
          id: input.userId
        },
        data: {
          passwordHash: await hash(input.newPass, env.BCRYPT_SALT)
        }
      });

      return {
        message: "Change password successful"
      };
    }),

  getEmbedYoutubeLink: studentProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.embedYoutube.findFirst({
      select: {
        liveLink: true,
        fallbackLink: true
      }
    });
  }),

  getZoomLink: mentorProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const mentor = await ctx.prisma.mentor.findFirst({
        where: {
          userId: input.userId
        },
        select: {
          id: true
        }
      });

      if (!mentor) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mentor not found"
        });
      }

      const mentorGroup = await ctx.prisma.mentorGroup.findFirst({
        where: {
          mentorId: mentor.id
        },
        select: {
          groupId: true
        }
      });

      if (!mentorGroup) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mentor group not found"
        });
      }

      return await ctx.prisma.group.findFirst({
        where: {
          id: mentorGroup.groupId
        },
        select: {
          zoomLink: true
        }
      });
    }),

  editZoomLink: mentorProcedure
    .input(z.object({ userId: z.string().uuid(), zoomLink: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const mentor = await ctx.prisma.mentor.findFirst({
        where: {
          userId: input.userId
        },
        select: {
          id: true
        }
      });

      if (!mentor) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mentor not found"
        });
      }

      const mentorGroup = await ctx.prisma.mentorGroup.findFirst({
        where: {
          mentorId: mentor.id
        },
        select: {
          groupId: true
        }
      });

      if (!mentorGroup) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mentor group not found"
        });
      }

      await ctx.prisma.group.update({
        where: {
          id: mentorGroup.groupId
        },
        data: {
          zoomLink: input.zoomLink
        }
      });

      return {
        message: "Zoom link updated"
      };
    })
});
