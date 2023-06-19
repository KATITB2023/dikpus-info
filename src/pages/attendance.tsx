import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { type NextPage } from "next";
import { UserRole } from "@prisma/client";
import { MenteeAttendance } from "~/component/attendance/MenteeAttendance";
import { MentorAttendance } from "~/component/attendance/MentorAttendance";
import PageLayout from "~/layout";

const Attendance: NextPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") signIn();
  });

  const role = session?.user.role;

  return (
    <PageLayout title='Absen'>
      {role === UserRole.MENTOR ? <MentorAttendance /> : <MenteeAttendance />}
    </PageLayout>
  );
};

export default Attendance;
