import { signIn, useSession } from 'next-auth/react';
import ProfileBody from '~/components/profile/ProfileBody';
import PageLayout from '~/layout';

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    signIn();
    return;
  }
  const role = session?.user.role;
  const id = session?.user.id;

  if (!role || !id) return null;

  return (
    <PageLayout title='Profile'>
      <ProfileBody id={id} role={role} />
    </PageLayout>
  );
}
