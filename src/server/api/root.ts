import { createTRPCRouter } from '~/server/api/trpc';
import { assignmentRouter } from './routers/assignment';
import { attendanceRouter } from './routers/attendance';
import { profileRouter } from './routers/profile';
import { storageRouter } from './routers/storage';
import { utilityRouter } from './routers/utility';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  assignment: assignmentRouter,
  attendance: attendanceRouter,
  profile: profileRouter,
  storage: storageRouter,
  utility: utilityRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
