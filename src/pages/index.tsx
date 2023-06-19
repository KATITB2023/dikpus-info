import {
  Flex,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast
} from '@chakra-ui/react';
import PageLayout from '~/layout';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/router';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import { useState } from 'react';

interface SignInProps {
  csrfToken: string;
}

export default function SignIn({ csrfToken }: SignInProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState({ nim: '', password: '' });
  const toast = useToast();

  const handleRedirect = () => {
    const role = session?.user.role;
    role === UserRole.MENTOR
      ? void router.push('/attendance')
      : void router.push('/assignment');
  };

  const handleError = (message: string) => {
    toast({
      title: 'Error',
      description: `${message}`,
      status: 'error',
      duration: 3000,
      isClosable: true
    });
  };

  const handleLogIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      nim: userInfo.nim,
      password: userInfo.password,
      csrfToken: csrfToken,
      redirect: false
    });

    if (res?.error) handleError(res?.error);
    if (res?.url) handleRedirect();
  };

  return (
    <PageLayout title='Log In - KAT ITB 2023' titleOnly={true}>
      <Flex minH='80vh' align='center' justify='center' direction='column'>
        <Heading>Diklat Terpusat</Heading>
        <Box width='450px'>
          <form>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
            <FormControl my={6}>
              <FormLabel>NIM</FormLabel>
              <Input
                type='text'
                name='nim'
                placeholder='NIM'
                value={userInfo.nim}
                onChange={({ target }) =>
                  setUserInfo({ ...userInfo, nim: target.value })
                }
                isRequired
              />
            </FormControl>
            <FormControl my={6}>
              <FormLabel>Password</FormLabel>
              <Input
                type='password'
                name='password'
                placeholder='Password'
                value={userInfo.password}
                onChange={({ target }) =>
                  setUserInfo({ ...userInfo, password: target.value })
                }
                isRequired
              />
            </FormControl>
            <Flex justify='center'>
              <Button
                colorScheme='teal'
                type='submit'
                my={4}
                onClick={(e) => void handleLogIn(e)}
              >
                Submit
              </Button>
            </Flex>
          </form>
        </Box>
      </Flex>
    </PageLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken
    }
  };
}
