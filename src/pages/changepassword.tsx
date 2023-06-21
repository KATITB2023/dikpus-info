import { Flex, Heading, Box, IconButton } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FiArrowLeft } from "react-icons/fi";
import PageLayout from "~/layout";
import ChangePasswordForm from "~/component/ChangePasswordForm";
import { useRouter } from "next/router";
import { Redirect } from "~/component/Redirect";

export default function ChangePassword() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return <Redirect />;

  return (
    <PageLayout title='Password' titleOnly={true}>
      <Flex minH='80vh' align='center' justify='center' direction='column'>
        <Heading textAlign='center'>Change Password</Heading>
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
          <ChangePasswordForm />
        </Box>
      </Flex>
    </PageLayout>
  );
}
