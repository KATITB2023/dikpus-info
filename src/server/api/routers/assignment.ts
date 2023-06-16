import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  studentProcedure,
  mentorProcedure,
  protectedProcedure
} from '~/server/api/trpc';

export const assignmentRouter = createTRPCRouter({
  getDeskripsiTugas: studentProcedure
    .input(
      z.object({
        namaTugas: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.findMany({
        where: {
          title: input.namaTugas
        }
      });
    }),

  getHasilTugas: mentorProcedure
    .input(
      z.object({
        userId: z.string(),
        studentId: z.string().optional(),
        namaTugas: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const submissionList = await ctx.prisma.assignmentSubmission.findMany({
        where: {
          assignment: {
            is: {
              title: input.namaTugas
            }
          },
          student: {
            is: {
              id: input.studentId,
              mentor: {
                id: input.userId
              }
            }
          }
        },
        include: {
          student: true
        }
      });
      return submissionList;
    }),

  getListNamaTugas: protectedProcedure.query(async ({ ctx }) => {
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

      if (!student) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "Student doesn't exist"
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
        message: 'Upload successful'
      };
    })
});
