import { UserRole } from "@prisma/client";
import PageLayout from "~/layout";
import MentorAssignment from "~/component/assignment/MentorAssignment";
import MenteeAssigment from "~/component/assignment/MenteeAssigment";
import { useSession } from "next-auth/react";
import { Redirect } from "~/component/Redirect";

export default function Assignment() {
  const { data: session } = useSession();

  if (!session) return <Redirect />;

  const role = session.user.role;

  return (
    <PageLayout title='Tugas'>
      {role === UserRole.MENTOR ? <MentorAssignment /> : <MenteeAssigment />}
    </PageLayout>
  );
}
