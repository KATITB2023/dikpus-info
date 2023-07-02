import { z } from "zod";
import {
  createTRPCRouter,
  studentProcedure,
  protectedProcedure
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
        student: {
          select: {
            firstName: true,
            lastName: true,
            fakultas: true,
            accepted: true,
            userId: true
          }
        },
        clue: {
          select: {
            divisi: true,
            clue: true,
            link: true
          }
        }
      }
    });

    // ts di fe meledak kalau ga gini....
    if (!announcement) {
      return {
        student: {
          accepted: false
        },
        clue: {
          clue: "Dengan berat hati kami mengumumkan bahwa Anda belum lolos proses seleksi calon panitia OSKM 2023. Namun, jika Anda merasa hasil tidak sesuai dengan harapan, Anda dapat melakukan banding di area DPR (Depan Plaza Widya) dengan panitia yang bertugas. Terima kasih, semoga lancar dan tetap semangat!",
          divisi: "Banding",
          link: ""
        }
      };
    }

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
      });

      return createClue;
    }),

  addAcceptance: protectedProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            studentId: z.string().uuid(),
            clueId: z.string().uuid()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = input.data;

      await ctx.prisma.acceptance.createMany({
        data
      });

      const studentIds = data.map((el) => el.studentId);

      await ctx.prisma.student.updateMany({
        where: {
          id: {
            in: studentIds
          }
        },
        data: {
          accepted: true
        }
      });

      return {
        status: "Update acceptance successfull"
      };
    }),

  getShowClue: protectedProcedure.query(async ({ ctx }) => {
    const showClueStatus = await ctx.prisma.showClue.findFirst({
      select: {
        show: true
      }
    });

    return showClueStatus;
  }),

  updateShowClue: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        show: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.showClue.update({
        where: {
          id: input.id
        },
        data: {
          show: input.show
        }
      });

      return {
        message: "Updated successfully."
      };
    }),

  createShowClue: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.showClue.create({
      data: {
        show: false
      }
    });

    return {
      message: "Success"
    };
  })
});
