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

      await ctx.prisma.event.create({
        data: {
          title: input.title,
          materialPath: input.materialPath,
          startTime: new Date(input.startTime),
          endTime: new Date(input.endTime)
        }
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

      await ctx.prisma.assignment.create({
        data: {
          title: input.title,
          description: input.description,
          deadline: new Date(input.deadline)
        }
      });

      return {
        message: 'Assignment added successfully'
      };
    })
});
