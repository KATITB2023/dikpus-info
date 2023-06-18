import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  studentProcedure,
  mentorProcedure,
  protectedProcedure
} from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
  getAssignmentDescription: studentProcedure
    .input(
      z.object({
        namaTugas: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.findMany({
        where: {
          title: input.namaTugas
        }
      });
    }),

  getAssignmentResult: mentorProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        studentId: z.string().optional(),
        namaTugas: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      // get mentorId
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

      // get all studentId
      const students = await ctx.prisma.student.findMany({
        where: {
          groupId: {
            in: groups.map((group) => group.id)
          },
          id: input.studentId
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
                  firstName: true,
                  lastName: true,
                  group: {
                    select: {
                      group: true
                    }
                  },
                  submission: {
                    select: {
                      filePath: true,
                      assignment: {
                        select: {
                          title: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      return {
        event: events.map((event) => {
          return {
            ...event,
            attendances: event.attendances.filter((attendance) =>
              studentIds.includes(attendance.studentId)
            ).map((attendance) => {
              return {
                ...attendance,
                student: {
                  ...attendance.student,
                  submission: input.namaTugas ? attendance.student.submission.filter((sub) => 
                    sub.assignment.title === input.namaTugas
                  ) : attendance.student.submission
                }
              }
            })
          }
        })
      }
    }),

  getAssignmentNameList: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.assignment.findMany({
      select: {
        title: true
      }
    });
  }),

  updateSubmission: studentProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(),
        userId: z.string().uuid(),
        fileUrl: z.string()
      })
    )
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

      await ctx.prisma.assignmentSubmission.updateMany({
        where: {
          studentId: student.id,
          assignmentId: input.assignmentId
        },
        data: {
          filePath: input.fileUrl
        }
      });

      return {
        message: "Upload successful"
      };
    })
});
