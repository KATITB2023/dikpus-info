import PageLayout from "~/layout";
import { signIn, useSession } from "next-auth/react";
import { Box } from "@chakra-ui/react";
import { UserRole } from "@prisma/client";

const Assignment = () => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return signIn();
  }

  const role = session?.user.role;

  return (
    <PageLayout title='Absen'>
      {role === UserRole.MENTOR ? (
        <Box>Assignment Mentor</Box>
      ) : (
        <Box>Assignment Mentee</Box>
      )}
    </PageLayout>
  );
};

export default Assignment;
