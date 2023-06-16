import { AttendanceStatus } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  mentorProcedure,
} from "~/server/api/trpc";

export const attendanceRouter = createTRPCRouter({
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

      // error handling
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
      

      // get all attendance
      const attendances = await ctx.prisma.attendance.findMany({
        where: {
          studentId: {
            in: students.map(item => item.id)
          },
          date: input.tanggal,
          status: {
            not: AttendanceStatus.TIDAK_HADIR
          }
        },
        select: {
          // TODO
          // data harus ada dari table attendance dan attendanceReason
          id: true,
          date: true,
          status: true,
          studentId: true
        }
      })

      return attendances
        .map(item => {
          return {
            ...item,
            date: item.date.toISOString()
          }
        }
      )
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

  getListKelompok: mentorProcedure
    .query(async ({ ctx }) => {
      // TODO
      // get list kelompok

      // cari semua kelompok
      const groups = await ctx.prisma.mentor.findMany({
        select: {
          group: true
        }
      })

      // filter kelompok yang unik pakai Set
      const uniqueGroups = [...new Set(groups.map(item => item.group))]

      // return
      return uniqueGroups
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
