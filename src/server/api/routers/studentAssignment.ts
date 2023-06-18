// import { z } from "zod";
import {
  createTRPCRouter,
  // studentProcedure,
} from "~/server/api/trpc";

export const studentAssignmentRouter = createTRPCRouter({
  // getDeskripsiTugas: studentProcedure
  //   .input(z.object({
  //     namaTugas: z.string()
  //   }))
  //   .query(async ({ ctx, input }) => {
  //     // TODO
  //     // get deskripsi tugas by nama tugas
  //     return input.namaTugas
  //   }),

  // getListNamaTugas: studentProcedure
  //   .query(async ({ ctx }) => {
  //     // TODO
  //     // get list semua nama tugas
  //     return []
  //   }),

  // updateSubmission: studentProcedure
  //   .input(z.object({
  //     assignmentId: z.string(),
  //     userId: z.string(),
  //     fileUrl: z.string()
  //   }))
  //   .mutation(async ({ ctx, input }) => {
  //     // TODO
  //     // update status submisi dari tugas based on input
  //     return null
  //   })
});
