import { z } from "zod";
import {
  createTRPCRouter,
  studentProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const announcementRouter = createTRPCRouter({
  getAnnouncement: studentProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const announcement = await ctx.prisma.acceptance.findFirst({
      where: {
        student: {
          is: {
            userId
          }
        }
      },
      select: {
        id: true,
        studentId: true,
        clueId: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
            fakultas: true,
            accepted: true,
            userId: true,
          }
        },
        clue: {
          select: {
            id: true,
            divisi: true,
            clue: true,
            link: true,
          }
        }
      }
    })

    return announcement;
  }),

  addClue: protectedProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            divisi: z.string(),
            clue: z.string(),
            link: z.string()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = input.data;

      const createClue = await ctx.prisma.clue.createMany({
        data
      })

      return createClue;
    }),

  addAcceptance: protectedProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            studentId: z.string().uuid(),
            clueId: z.string().uuid(),
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = input.data;

      const createAcceptance = await ctx.prisma.acceptance.createMany({
        data
      })

      return createAcceptance;
    })
})