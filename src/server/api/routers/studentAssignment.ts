import { z } from 'zod';
import { createTRPCRouter, studentProcedure } from '~/server/api/trpc';

export const studentAssignmentRouter = createTRPCRouter({
  getDeskripsiTugas: studentProcedure
    .input(
      z.object({
        namaTugas: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.findMany({
        where: {
          title: input.namaTugas
        }
      });
    }),

  getListNamaTugas: studentProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.assignment.findMany({
      select: {
        title: true
      }
    });
  }),

  updateSubmission: studentProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        userId: z.string(),
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

      await ctx.prisma.assignmentSubmission.updateMany({
        where: {
          studentId: student?.id,
          assignmentId: input.assignmentId
        },
        data: {
          filePath: input.fileUrl
        }
      });
    })
});
