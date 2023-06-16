import { z } from "zod";
import {
  createTRPCRouter,
  mentorProcedure,
} from "~/server/api/trpc";

export const mentorAssignmentRouter = createTRPCRouter({
  getTugas: mentorProcedure
    .input(z.object({
      userId: z.string(),
      studentId: z.string().optional(),
      namaTugas: z.string().optional(),
    }))
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
            },
          },
        },
        include: {
          student: true
        }
      })
      return submissionList;
    }),

  getListNamaTugas: mentorProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.assignment.findMany({
        select: {
          title: true
        }
      });
    }),
});
