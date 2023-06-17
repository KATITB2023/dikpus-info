import { z } from 'zod';
import { createTRPCRouter, mentorProcedure } from '~/server/api/trpc';

export const utilityRouter = createTRPCRouter({
  addEvent: mentorProcedure
    .input(
      z.object({
        title: z.string(),
        materialPath: z.string(),
        startTime: z.date(),
        endTime: z.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.event.create({
        data: {
          title: input.title,
          materialPath: input.materialPath,
          startTime: input.startTime,
          endTime: input.endTime
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
        deadline: z.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.assignment.create({
        data: {
          title: input.title,
          description: input.description,
          deadline: input.deadline
        }
      });

      return {
        message: 'Assignment added successfully'
      };
    })
});
