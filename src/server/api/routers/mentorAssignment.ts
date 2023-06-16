import { z } from "zod";
import {
  createTRPCRouter,
  mentorProcedure,
} from "~/server/api/trpc";

export const mentorAssignmentRouter = createTRPCRouter({
  getTugas: mentorProcedure
    .input(z.object({
      userId: z.string(),
      namaTugas: z.string().optional(),
      kelompok: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      // TODO
      // get tugas with optional filter [namaTugas, kelompok]
      return []
    }),

  getListNamaTugas: mentorProcedure
    .query(async ({ ctx }) => {
      // TODO
      // get list nama semua tugas
      return []
    }),

  getListKelompok: mentorProcedure
    .query(async ({ ctx }) => {
      // TODO
      // get list semua kelompok
      return []
    })
});
