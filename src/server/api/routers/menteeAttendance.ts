import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, studentProcedure } from '~/server/api/trpc';

export const menteeAttendanceRouter = createTRPCRouter({
  getEvents: studentProcedure.query(async ({ ctx }) => {
    return ctx.prisma.event.findMany();
  }),

  setAttendance: studentProcedure
    .input(z.object({ user_id: z.string(), event_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findFirst({
        where: {
          userId: input.user_id
        },
        select: {
          id: true
        }
      });

      if (!student) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Student not found'
        });
      }

      const event = await ctx.prisma.event.findFirst({
        where: {
          id: input.event_id
        }
      });

      if (!event) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Event not found'
        });
      }

      const attendance = await ctx.prisma.attendance.findMany({
        where: {
          studentId: student.id,
          eventId: input.event_id
        }
      });

      if (attendance.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Attendance already set'
        });
      }

      const currentTime = new Date(Date.now());
      if (currentTime > event.startTime && currentTime < event.endTime) {
        await ctx.prisma.attendance.create({
          data: {
            date: currentTime,
            status: 'HADIR',
            studentId: student.id,
            eventId: input.event_id
          }
        });

        return {
          message: 'Attendance Recorded'
        };
      } else if (currentTime < event.startTime) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Event not yet started'
        });
      } else if (currentTime > event.endTime) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Event is finished'
        });
      }
    })
});
