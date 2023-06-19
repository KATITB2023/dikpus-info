import { Flex, Heading, Box, IconButton } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import PageLayout from "~/layout";
import ChangePasswordForm from "~/component/ChangePasswordForm";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChangePassword() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") signIn();
  });

  return (
    <>
      <PageLayout title='Log In - KAT ITB 2023' titleOnly={true}>
        <Flex minH='80vh' align='center' justify='center' direction='column'>
          <Heading>Change Password</Heading>
          <Flex w='550px'>
            <IconButton
              variant='unstyled'
              fontSize='30px'
              aria-label='back'
              icon={<FiArrowLeft />}
            />
          </Flex>
          <Box width='450px'>
            <ChangePasswordForm />
          </Box>
        </Flex>
      </PageLayout>
    </>
  );
}
