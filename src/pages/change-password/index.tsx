import { Flex, Heading, Box, IconButton, Spacer } from '@chakra-ui/react'
import { FiArrowLeft } from 'react-icons/fi';
import PageLayout from '~/layout';
import ChangePasswordForm from '~/components/ChangePasswordForm';

export default function ChangePassword() {
  // const hello = api.example.hello.useQuery({ text: 'from tRPC' });

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