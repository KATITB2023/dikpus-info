import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { type NextPage } from "next";
import PageLayout from "~/layout";
import MentorAssignment from "~/component/assignment/MentorAssignment";
import AssignmentMenteeSidePage from "~/component/assignment/assignment-mentee-side";

const Assignment: NextPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") signIn();
  });

  const role = session?.user.role;

  return (
    <PageLayout title='Tugas'>
      {role === UserRole.MENTOR ? (
        <MentorAssignment />
      ) : (
        <AssignmentMenteeSidePage />
      )}
    </PageLayout>
  );
};

export default Assignment;
