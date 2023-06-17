/* eslint-disable @typescript-eslint/no-floating-promises */
import PageLayout from '~/layout';
import { useSession } from 'next-auth/react';
import { Box } from '@chakra-ui/react';
import { UserRole } from '@prisma/client';
import { MenteeAttendance } from '~/component/attendance/MenteeAttendance';
import { RedirectLogin } from '~/component/RedirectLogin';

const Attendance = () => {
  const { data: session, status } = useSession();

  if (!session && status !== 'loading') {
    // pake useRouter next gabisa idk why
    return <RedirectLogin />;
  }

  const role = session?.user.role;

  return (
    <PageLayout title='Absen'>
      {role === UserRole.MENTOR ? <Box>Mentor</Box> : <MenteeAttendance />}
    </PageLayout>
  );
};

export default Attendance;
