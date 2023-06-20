import { createTRPCRouter } from "~/server/api/trpc";
import { assignmentRouter } from "~/server/api/routers/assignment";
import { attendanceRouter } from "~/server/api/routers/attendance";
import { profileRouter } from "~/server/api/routers/profile";
import { storageRouter } from "~/server/api/routers/storage";
import { utilityRouter } from "~/server/api/routers/utility";

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
