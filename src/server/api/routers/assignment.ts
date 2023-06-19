import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  studentProcedure,
  mentorProcedure,
  protectedProcedure
} from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
  getAssignmentDescription: studentProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        namaTugas: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findFirst({
        where: {
          userId: input.userId
        },
        select: {
          id: true
        }
      });

      if (!student) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Student not found"
        });
      }

      return await ctx.prisma.assignment.findMany({
        where: {
          title: input.namaTugas
        },
        include: {
          submission: {
            where: {
              studentId: student.id
            },
            select: {
              filePath: true
            }
          }
        }
      });
    }),

  getAssignmentResult: mentorProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        studentId: z.string().optional(),
        namaTugas: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      // get mentorId
      const mentor = await ctx.prisma.mentor.findFirst({
        where: {
          userId: input.userId
        },
        select: {
          id: true
        }
      });

      // error handling if mentor's user id not found
      if (!mentor) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mentor not found"
        });
      }

      const groups = await ctx.prisma.group.findMany({
        where: {
          mentorGroup: {
            some: {
              mentorId: mentor.id
            }
          }
        },
        select: {
          id: true,
          group: true
        }
      });

      // error handling if group not found
      if (!groups) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Groups not found"
        });
      }

      const groupIds = groups.map((group) => group.id);

      const submissionList = await ctx.prisma.assignment.findMany({
        where: {
          title: input.namaTugas
        },
        select: {
          id: true,
          title: true,
          description: true,
          submission: {
            select: {
              id: true,
              filePath: true,
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  fakultas: true,
                  group: {
                    select: {
                      id: true,
                      group: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      return {
        submissions: submissionList.map((submission) => {
          return {
            ...submission,
            submission: submission.submission.filter(
              (sub) =>
                groupIds.includes(sub.student.group.id) &&
                (input.studentId === undefined ||
                  sub.student.id === input.studentId)
            )
          };
        })
      };
    }),

  getAssignmentNameList: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.assignment.findMany({
      select: {
        title: true
      }
    });
  }),

  updateSubmission: studentProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(),
        userId: z.string().uuid(),
        fileUrl: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findFirst({
        where: {
          userId: input.userId
        },
        select: {
          id: true
        }
      });

      if (!student) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Student not found"
        });
      }

      await ctx.prisma.assignmentSubmission.updateMany({
        where: {
          studentId: student.id,
          assignmentId: input.assignmentId
        },
        data: {
          filePath: input.fileUrl
        }
      });

      return {
        message: "Upload successful"
      };
    })
});
