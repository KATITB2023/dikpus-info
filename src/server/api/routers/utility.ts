import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, mentorProcedure } from '~/server/api/trpc';

const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return !isNaN(Number(date));
};

export const utilityRouter = createTRPCRouter({
  addEvent: mentorProcedure
    .input(
      z.object({
        title: z.string(),
        materialPath: z.string(),
        startTime: z.string(),
        endTime: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isValidDate(input.startTime) || !isValidDate(input.endTime)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Incorrect date format'
        });
      }

      const event = await ctx.prisma.event.create({
        data: {
          title: input.title,
          materialPath: input.materialPath,
          startTime: input.startTime,
          endTime: input.endTime
        }
      });

      const students = await ctx.prisma.student.findMany({
        select: {
          id: true
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      students.forEach(async (student) => {
        await ctx.prisma.attendance.create({
          data: {
            date: new Date(Date.now()),
            studentId: student.id,
            eventId: event.id
          }
        });
      });

      return {
        message: 'Event added successfully'
      };
    }),

  addAssignment: mentorProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        deadline: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isValidDate(input.deadline)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Incorrect date format'
        });
      }

      const assigment = await ctx.prisma.assignment.create({
        data: {
          title: input.title,
          description: input.description,
          deadline: input.deadline
        }
      });

      const students = await ctx.prisma.student.findMany({
        select: {
          id: true
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      students.forEach(async (student) => {
        await ctx.prisma.assignmentSubmission.create({
          data: {
            studentId: student.id,
            assignmentId: assigment.id
          }
        });
      });

      return {
        message: 'Assignment added successfully'
      };
    })
});
