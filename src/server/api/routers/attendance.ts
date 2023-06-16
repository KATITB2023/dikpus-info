import { z } from "zod";
import {
  createTRPCRouter,
  mentorProcedure,
} from "~/server/api/trpc";

export const attendanceRouter = createTRPCRouter({
  getAbsensi: mentorProcedure
    .input(z.object({
      userId: z.string(),
      tanggal: z.string().optional(),
      kelompok: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      // TODO
      // get absensi
      return input.userId;
    }),

  getListTanggal: mentorProcedure
    .query(async ({ ctx }) => {
      // TODO
      // get list tanggal absensi
      return [];
    }),

  getListKelompok: mentorProcedure
    .query(async ({ ctx }) => {
      // TODO
      // get list kelompok
      return []
    }),

  editAbsensi: mentorProcedure
    .input(z.object({
      mentorId: z.string(),
      studentId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO
      // edit absensi
      return [];
    })
});
