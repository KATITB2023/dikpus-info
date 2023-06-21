import { UserRole } from "@prisma/client";
import PageLayout from "~/layout";
import MentorAssignment from "~/component/assignment/MentorAssignment";
import MenteeAssigment from "~/component/assignment/MenteeAssigment";
import { useSession } from "next-auth/react";
import { Redirect } from "~/component/Redirect";

export default function Assignment() {
  const { data: session } = useSession();
  const role = session?.user.role;

  if (!session) return <Redirect />;

  return (
    <PageLayout title='Tugas'>
      {role === UserRole.MENTOR ? <MentorAssignment /> : <MenteeAssigment />}
    </PageLayout>
  );
}
