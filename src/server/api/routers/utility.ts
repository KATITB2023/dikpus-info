import { z } from "zod";
import { createTRPCRouter, mentorProcedure } from "~/server/api/trpc";

export const utilityRouter = createTRPCRouter({
  addEvent: mentorProcedure
    .input(
      z.object({
        title: z.string(),
        materialPath: z.string(),
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
    })
});
