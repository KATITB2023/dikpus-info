import { TRPCError } from "@trpc/server";
import { AttendanceStatus } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  studentProcedure,
  mentorProcedure
} from "~/server/api/trpc";

export const attendanceRouter = createTRPCRouter({
  getEvents: studentProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findFirst({
        where: {
          userId: input.userId
        }
      });

      if (!student) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Student not found"
        });
      }

      const attendance = await ctx.prisma.attendance.findMany({
        where: {
          studentId: student.id
        },
        select: {
          status: true,
          event: true
        }
      });

      return attendance;
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
          code: "BAD_REQUEST",
          message: "Student not found"
        });
      }

      const event = await ctx.prisma.event.findFirst({
        where: {
          id: input.eventId
        }
      });

      if (!event) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event not found"
        });
      }

      const attendance = await ctx.prisma.attendance.findFirst({
        where: {
          studentId: student.id,
          eventId: input.eventId
        }
      });

      if (attendance && attendance.status === "HADIR") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Attendance already set"
        });
      }

      const currentTime = new Date(Date.now());
      if (currentTime > event.startTime && currentTime < event.endTime) {
        await ctx.prisma.attendance.updateMany({
          where: {
            studentId: student.id,
            eventId: input.eventId
          },
          data: {
            date: currentTime,
            status: "HADIR"
          }
        });

        return {
          message: "Attendance Recorded"
        };
      } else if (currentTime < event.startTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event not yet started"
        });
      } else if (currentTime > event.endTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event is finished"
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
          code: "BAD_REQUEST",
          message: "Mentor not found"
        });
      }

      // get mentor group
      const mentorGroups = await ctx.prisma.mentorGroup.findMany({
        where: {
          mentorId: mentor.id
        },
        select: {
          groupId: true
        }
      });

      if (mentorGroups.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mentor group not found"
        });
      }

      const groups = await ctx.prisma.group.findMany({
        where: {
          id: {
            in: mentorGroups.map((mentorGroup) => mentorGroup.groupId)
          }
        },
        select: {
          id: true,
          group: true
        }
      });

      if (groups.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group not found"
        });
      }

      // get all student_id
      const students = await ctx.prisma.student.findMany({
        where: {
          groupId: {
            in: groups.map((group) => group.id)
          }
        },
        select: {
          id: true
        }
      });

      const studentIds = students.map((student) => student.id);

      const events = await ctx.prisma.event.findMany({
        select: {
          title: true,
          startTime: true,
          endTime: true,
          attendances: {
            select: {
              id: true,
              status: true,
              studentId: true,
              eventId: true,
              student: {
                select: {
                  group: {
                    select: {
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
        event: events.map((event) => {
          return {
            ...event,
            attendances: event.attendances.filter((attendance) =>
              studentIds.includes(attendance.studentId)
            )
          };
        })
      };
    }),

  getEventList: mentorProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      select: {
        title: true
      }
    });
  }),

  editAttendance: mentorProcedure
    .input(
      z.object({
        attendanceId: z.string().uuid(),
        kehadiran: z.nativeEnum(AttendanceStatus)
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO
      // edit absensi
      await ctx.prisma.attendance.update({
        where: {
          id: input.attendanceId
        },
        data: {
          status: input.kehadiran
        }
      });

      return {
        message: "Edit attendance successful"
      };
    })
});
