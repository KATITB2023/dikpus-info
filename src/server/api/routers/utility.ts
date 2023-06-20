import { hash } from "bcrypt";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, mentorProcedure } from "~/server/api/trpc";

export const utilityRouter = createTRPCRouter({
  addEvent: mentorProcedure
    .input(
      z.object({
        title: z.string(),
        materialPath: z.string(),
        youtubeLink: z.string().optional(),
        startTime: z.coerce.date(),
        endTime: z.coerce.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [event, students] = await Promise.all([
        ctx.prisma.event.create({
          data: {
            title: input.title,
            materialPath: input.materialPath,
            youtubeLink: input.youtubeLink,
            startTime: input.startTime,
            endTime: input.endTime
          }
        }),
        ctx.prisma.student.findMany({
          select: {
            id: true
          }
        })
      ]);

      await Promise.all(
        students.map(async (student) => {
          await ctx.prisma.attendance.create({
            data: {
              date: new Date(Date.now()),
              studentId: student.id,
              eventId: event.id
            }
          });
        })
      );

      return {
        message: "Event added successfully"
      };
    }),

  addAssignment: mentorProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        deadline: z.coerce.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [assigment, students] = await Promise.all([
        ctx.prisma.assignment.create({
          data: {
            title: input.title,
            description: input.description,
            deadline: input.deadline
          }
        }),
        ctx.prisma.student.findMany({
          select: {
            id: true
          }
        })
      ]);

      await Promise.all(
        students.map(async (student) => {
          await ctx.prisma.assignmentSubmission.create({
            data: {
              studentId: student.id,
              assignmentId: assigment.id
            }
          });
        })
      );

      return {
        message: "Assignment added successfully"
      };
    }),

  resetPassword: mentorProcedure
    .input(z.object({ nim: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          nim: input.nim
        },
        data: {
          passwordHash: await hash(input.nim, env.BCRYPT_SALT)
        }
      });

      return {
        message: "Reset password successful"
      };
    }),

  createEmbedYoutubeLink: mentorProcedure
    .input(
      z.object({ liveLink: z.string().url(), fallbackLink: z.string().url() })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.embedYoutube.create({
        data: {
          liveLink: input.liveLink,
          fallbackLink: input.fallbackLink
        }
      });

      return {
        message: "Create link successful"
      };
    }),

  editEmbedYoutubeLink: mentorProcedure
    .input(
      z.object({
        embedId: z.string().uuid(),
        liveLink: z.string().url().optional(),
        fallbackLink: z.string().url().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.embedYoutube.update({
        where: {
          id: input.embedId
        },
        data: {
          liveLink: input.liveLink,
          fallbackLink: input.fallbackLink
        }
      });

      return {
        message: "Edit link successful"
      };
    })
});
