// import Head from 'next/head';
// import { api } from '~/utils/api';
import { Flex, Heading, Box } from '@chakra-ui/react'
import PageLayout from '~/layout';
import LoginForm from '~/components/LoginForm';

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <>
     <PageLayout title='Log In - KAT ITB 2023' titleOnly={true}>
        <Flex minH='80vh' align='center' justify='center' direction='column'>
          <Heading>Diklat Terpusat</Heading>
          <Box width='450px'>
            <LoginForm/>
          </Box>
        </Flex>
      </PageLayout>
    </>
  );
}
