import { Flex, Heading, Box, IconButton, Center, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FiArrowLeft } from "react-icons/fi";
import PageLayout from "~/layout";
import { useRouter } from "next/router";
import { Redirect } from "~/component/Redirect";
import { UserRole } from "@prisma/client";
import ChangeZoomLinkForm from "~/component/ChangeZoomLinkForm";

export default function ChangeZoom() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return <Redirect />;

  const role = session?.user.role;

  if (role === UserRole.STUDENT) {
    return (
      <Center minH='100vh'>
        <Text textAlign='center' fontSize='xl' fontFamily='SomarRounded-Bold'>
          Kamu ngapain ya disini @@
        </Text>
      </Center>
    );
  }

  return (
    <PageLayout title='Zoom' titleOnly={true}>
      <Flex minH='80vh' align='center' justify='center' direction='column'>
        <Heading textAlign='center'>Change Zoom Link</Heading>
        <Flex w={{ base: "100%", md: "550px" }} mt={2} mb={3}>
          <IconButton
            variant='unstyled'
            fontSize='30px'
            aria-label='back'
            icon={<FiArrowLeft />}
            onClick={() => router.back()}
          />
        </Flex>
        <Box w={{ base: "100%", md: "450px" }}>
          <ChangeZoomLinkForm />
        </Box>
      </Flex>
    </PageLayout>
  );
}
