import { getSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from "next";
import PageLayout from "~/layout";
import MentorAssignment from "~/component/assignment/MentorAssignment";
import MenteeAssigment from "~/component/assignment/MenteeAssigment";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}

export default function Assignment({
  session
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const role = session.user.role;

  return (
    <PageLayout title='Tugas'>
      {role === UserRole.MENTOR ? (
        <MentorAssignment session={session} />
      ) : (
        <MenteeAssigment session={session} />
      )}
    </PageLayout>
  );
}
