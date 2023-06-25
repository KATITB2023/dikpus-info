import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  studentProcedure,
  mentorProcedure,
  protectedProcedure
} from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
  getAssignmentDescription: studentProcedure.query(async ({ ctx }) => {
    const student = await ctx.prisma.student.findUnique({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        id: true
      }
    });

    if (!student)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Student not found"
      });

    return await ctx.prisma.assignment.findMany({
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

  // TODO: Hilangkan filter
  getAssignmentResult: mentorProcedure.query(async ({ ctx }) => {
    // get mentorId
    const mentor = await ctx.prisma.mentor.findUnique({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        id: true
      }
    });

    // error handling if mentor's user id not found
    if (!mentor)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Mentor not found"
      });

    const mentorGroups = await ctx.prisma.user
      .findUnique({
        where: {
          id: ctx.session.user.id
        }
      })
      .mentor()
      .mentorGroup({
        select: {
          groupId: true
        }
      });

    const groupIds = mentorGroups.map((mentorGroup) => mentorGroup.groupId);

    const submissionList = await ctx.prisma.assignment.findMany({
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
      submissions: submissionList.map((submission) => ({
        ...submission,
        submission: submission.submission.filter((sub) =>
          groupIds.includes(sub.student.group.id)
        )
      }))
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
        fileUrl: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findUnique({
        where: {
          userId: ctx.session.user.id
        },
        select: {
          id: true
        }
      });

      if (!student)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Student not found"
        });

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
