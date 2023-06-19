import { getSession } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { UserRole } from "@prisma/client";
import { MenteeAttendance } from "~/component/attendance/MenteeAttendance";
import { MentorAttendance } from "~/component/attendance/MentorAttendance";
import PageLayout from "~/layout";

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

export default function Attendance({
  session
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const role = session.user.role;

  return (
    <PageLayout title='Absen'>
      {role === UserRole.MENTOR ? <MentorAttendance /> : <MenteeAttendance />}
    </PageLayout>
  );
}
