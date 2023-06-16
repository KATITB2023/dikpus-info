import {Box, Button} from '@chakra-ui/react';
import Head from 'next/head';
// import { api } from '~/utils/api';
import {signIn} from "next-auth/react";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <>
      <Head>
        <title>Login - KAT ITB 2023</title>
      </Head>
      <Box>
        Ingfo dari tRPC:{' '}
        {/* {hello.data ? hello.data.greeting : 'Loading tRPC query...'} */}
      </Box>
        <Button onClick= {() => void signIn()}>
            Sign in
        </Button>
    </>
  );
}
