import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { MenteeAttendance } from "~/component/attendance/MenteeAttendance";
import { MentorAttendance } from "~/component/attendance/MentorAttendance";
import PageLayout from "~/layout";
import { Redirect } from "~/component/Redirect";

export default function Attendance() {
  const { data: session } = useSession();
  const role = session?.user.role;

  if (!session) {
    return <Redirect />;
  }

  return (
    <PageLayout title='Absen'>
      {role === UserRole.MENTOR ? <MentorAttendance /> : <MenteeAttendance />}
    </PageLayout>
  );
}
