import { AttendanceStatus } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  mentorProcedure,
} from "~/server/api/trpc";

export const mentorAttendanceRouter = createTRPCRouter({
  getAbsensi: mentorProcedure
    .input(z.object({
      userId: z.string(),
      tanggal: z.string().optional()
    }))
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
      })

      // error handling (kalau gak ada ini yg students gak mau jalan)
      if (!mentor) {
        throw new Error("Mentor not found");
      }

      // get all student_id
      const students = await ctx.prisma.student.findMany({
        where: {
          mentorId: mentor.id
        },
        select: {
          id: true
        }
      })
      

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
      })

      return attendances.map((attendance) => attendance.attendances).flat()
    }),


  getListTanggal: mentorProcedure
    .query(async ({ ctx }) => {
      // TODO
      // get list tanggal absensi
      return await ctx.prisma.attendance.findMany({
        select: {
          date: true
        }
      })

    }),

  editAbsensi: mentorProcedure
    .input(z.object({
      mentorId: z.string(),
      studentId: z.string(),
      kehadiran: z.nativeEnum(AttendanceStatus)
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO
      // edit absensi
      return await ctx.prisma.attendance.update({
        where: {
          id: input.studentId
        },
        data: {
          status: input.kehadiran
        }
      })
    })
});
