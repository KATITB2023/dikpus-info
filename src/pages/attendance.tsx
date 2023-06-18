import { signIn, useSession } from "next-auth/react";
import { type NextPage } from "next";
import { Box } from "@chakra-ui/react";
import { UserRole } from "@prisma/client";
import { MenteeAttendance } from "~/component/attendance/MenteeAttendance";
import PageLayout from "~/layout";

const Attendance: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") return signIn();

  const role = session?.user.role;

  return (
    <PageLayout title='Absen'>
      {role === UserRole.MENTOR ? <Box>Mentor</Box> : <MenteeAttendance />}
    </PageLayout>
  );
};

export default Attendance;
