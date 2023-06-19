import { UserRole } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from "next";
import PageLayout from "~/layout";
import MentorAssignment from "~/component/assignment/MentorAssignment";
import MenteeAssigment from "~/component/assignment/MenteeAssigment";
import { useSession } from "next-auth/react";

export default function Assignment() {
  const { data: session } = useSession();
  const role = session?.user.role;

  return (
    <PageLayout title='Tugas'>
      {role === UserRole.MENTOR ? <MentorAssignment /> : <MenteeAssigment />}
    </PageLayout>
  );
}
