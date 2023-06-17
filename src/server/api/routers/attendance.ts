import { TRPCError } from '@trpc/server';
import { AttendanceStatus } from '@prisma/client';
import { z } from 'zod';
import {
  createTRPCRouter,
  studentProcedure,
  mentorProcedure
} from '~/server/api/trpc';

export const attendanceRouter = createTRPCRouter({
  getEvents: studentProcedure.query(async ({ ctx }) => {
    return ctx.prisma.event.findMany();
  }),

  setAttendance: studentProcedure
    .input(z.object({ userId: z.string().uuid(), eventId: z.string().uuid() }))
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
          message: 'Student not found'
        });
      }

      const event = await ctx.prisma.event.findFirst({
        where: {
          id: input.eventId
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
          eventId: input.eventId
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
            eventId: input.eventId
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
    }),

  getAttendance: mentorProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        tanggal: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO
      // get absensi

      // get mentor_id
      const mentor = await ctx.prisma.mentor.findFirst({
        where: {
          userId: input.userId
        },
        select: {
          id: true
        }
      });

      // error handling (kalau gak ada ini yg students gak mau jalan)
      if (!mentor) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Mentor not found'
        });
      }

      // get all student_id
      const students = await ctx.prisma.student.findMany({
        where: {
          mentorId: mentor.id
        },
        select: {
          id: true
        }
      });

      // get all attendance per Event
      const attendances = await ctx.prisma.event.findMany({
        where: {
          attendances: {
            some: {
              id: {
                in: students.map((student) => student.id)
              }
            }
          }
        },
        select: {
          attendances: {
            select: {
              id: true,
              date: true,
              status: true,
              studentId: true,
              eventId: true,
              createdAt: true,
              updatedAt: true,
              reason: {
                select: {
                  id: true,
                  reason: true,
                  attendanceId: true,
                  createdAt: true,
                  updatedAt: true
                }
              }
            }
          }
        }
      });

      return attendances.map((attendance) => attendance.attendances).flat();
    }),

  getDateList: mentorProcedure.query(async ({ ctx }) => {
    // TODO
    // get list tanggal absensi
    return await ctx.prisma.attendance.findMany({
      select: {
        date: true
      }
    });
  }),

  editAttendance: mentorProcedure
    .input(
      z.object({
        mentorId: z.string().uuid(),
        studentId: z.string().uuid(),
        kehadiran: z.nativeEnum(AttendanceStatus)
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO
      // edit absensi
      await ctx.prisma.attendance.update({
        where: {
          id: input.studentId
        },
        data: {
          status: input.kehadiran
        }
      });

      return {
        message: 'Edit attendance successful'
      };
    })
});
