import { Center, Text } from "@chakra-ui/react";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Redirect } from "~/component/Redirect";
import ProfileBody from "~/component/profile/ProfileBody";
import PageLayout from "~/layout";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return <Redirect />;
  }

  const role = session?.user.role;
  const id = session?.user.id;

  if (role === UserRole.MENTOR) {
    return (
      <Center minH='100vh'>
        <Text textAlign='center' fontSize='xl' fontFamily='SomarRounded-Bold'>
          Kamu tidak bisa membuka profile :(
        </Text>
      </Center>
    );
  }

  if (!role || !id) return null;

  return (
    <PageLayout title='Profile'>
      <ProfileBody id={id} />
    </PageLayout>
  );
}
