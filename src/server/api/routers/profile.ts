import { z } from "zod";
import {
  createTRPCRouter,
  mentorProcedure,
  protectedProcedure,
  studentProcedure
} from "~/server/api/trpc";
import { compare, hash } from "bcrypt";
import { sprintf } from "sprintf-js";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

export const profileRouter = createTRPCRouter({
  getProfile: studentProcedure.query(async ({ ctx }) => {
    const student = await ctx.prisma.student.findUnique({
      where: {
        userId: ctx.session.user.id
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

    if (!student)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Student not found"
      });

    return student;
  }),

  editProfile: studentProcedure
    .input(
      z.object({
        profileURL: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.student.update({
        where: {
          userId: ctx.session.user.id
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
        curPass: z.string(),
        newPass: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id
        },
        select: {
          passwordHash: true
        }
      });

      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found"
        });

      const isValid = await compare(input.curPass, user.passwordHash);
      if (!isValid)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect current password"
        });

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id
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
    // TODO: Handle multiple links
    return await ctx.prisma.embedYoutube.findFirst({
      select: {
        liveLink: true,
        fallbackLink: true
      }
    });
  }),

  getZoomLink: mentorProcedure.query(async ({ ctx }) => {
    const mentor = await ctx.prisma.mentor.findUnique({
      where: {
        userId: ctx.session.user.id
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

    // TODO: Handle multiple groups
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

    return await ctx.prisma.group.findUnique({
      where: {
        id: mentorGroup.groupId
      },
      select: {
        zoomLink: true
      }
    });
  }),

  editZoomLink: mentorProcedure
    .input(z.object({ zoomLink: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const mentor = await ctx.prisma.mentor.findUnique({
        where: {
          userId: ctx.session.user.id
        },
        select: {
          id: true
        }
      });

      if (!mentor)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mentor not found"
        });

      // TODO: Handle multiple groups
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
    }),

  getBroadcast: studentProcedure.query(async ({ ctx }) => {
    const student = await ctx.prisma.student.findUnique({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        id: true,
        firstName: true,
        lastName: true
      }
    });

    if (!student)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Student not found"
      });

    const studentClass = await ctx.prisma.studentClass.findMany({
      where: {
        studentId: student.id
      },
      select: {
        classId: true
      }
    });

    const classIds = studentClass.map((c) => c.classId);

    const classes = await ctx.prisma.class.findMany({
      where: {
        id: {
          in: classIds
        }
      },
      select: {
        broadcastTemplate: true
      }
    });

    const broadcasts = classes.map((c) =>
      sprintf(c.broadcastTemplate, {
        name: student.lastName
          ? `${student.firstName} ${student.lastName}`
          : student.firstName
      })
    );

    return {
      broadcasts
    };
  })
});
