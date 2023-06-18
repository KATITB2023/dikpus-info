import { Flex, Heading, Box, IconButton } from '@chakra-ui/react'
import { FiArrowLeft } from 'react-icons/fi';
import PageLayout from '~/layout';
import ChangePasswordForm from '~/component/ChangePasswordForm';
import { signIn, useSession } from "next-auth/react";

export default function ChangePassword() {
  const { status } = useSession();
  // const hello = api.example.hello.useQuery({ text: 'from tRPC' });
  if (status === "unauthenticated") return signIn();

  return (
    <>
     <PageLayout title='Log In - KAT ITB 2023'>
        <Flex minH='80vh' align='center' justify='center' direction='column'>
          <Heading>Change Password</Heading>
          <Flex w='550px'>
            <IconButton variant='unstyled' fontSize='30px' aria-label='back' icon={<FiArrowLeft />}/>
          </Flex>
          <Box width='450px'>
            <ChangePasswordForm />
          </Box>
        </Flex>
      </PageLayout>
    </>
  );
}