import { exampleRouter } from '~/server/api/routers/example';
import { metricsRouter } from '~/server/api/routers/metrics';
import { createTRPCRouter } from '~/server/api/trpc';
import { assignmentRouter } from './routers/assignment';
import { profileRouter } from './routers/profile';
import { attendanceRouter } from './routers/attendance';
import { menteeAttendanceRouter } from './routers/menteeAttendance';
import { storageRouter } from './routers/storage';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  assignment: assignmentRouter,
  profile: profileRouter,
  attendance: attendanceRouter,
  menteeAttendance: menteeAttendanceRouter,
  metrics: metricsRouter,
  storage: storageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
