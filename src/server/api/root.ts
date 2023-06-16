import { exampleRouter } from '~/server/api/routers/example';
import { metricsRouter } from '~/server/api/routers/metrics';
import { createTRPCRouter } from '~/server/api/trpc';
import { profileRouter } from './routers/profile';
import { mentorAttendanceRouter } from './routers/mentorAttendance';
import { menteeAttendanceRouter } from './routers/menteeAttendance';
import { studentAssignmentRouter } from './routers/studentAssignment';
import { mentorAssignmentRouter } from './routers/mentorAssignment';
import { storageRouter } from './routers/storage';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  profile: profileRouter,
  mentorAttendance: mentorAttendanceRouter,
  menteeAttendance: menteeAttendanceRouter,
  studentAssignment: studentAssignmentRouter,
  mentorAssignment: mentorAssignmentRouter,
  metrics: metricsRouter,
  storage: storageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
