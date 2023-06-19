import {
  Flex,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast
} from "@chakra-ui/react";
import PageLayout from "~/layout";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/router";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from "next";
import { useState } from "react";

export default function SignIn({
  csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ nim: "", password: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleRedirect = () => {
    const role = session?.user.role;
    role === UserRole.MENTOR
      ? void router.push("/attendance")
      : void router.push("/assignment");
  };

  const handleError = (message: string) => {
    toast({
      title: "Error",
      description: `${message}`,
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "top"
    });
  };

  const handleLogIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      nim: userInfo.nim,
      password: userInfo.password,
      redirect: false,
      csrfToken
    });

    if (res?.error) handleError(res?.error);
    if (res?.url) handleRedirect();
    setLoading(false);
  };

  if (session) {
    handleRedirect();
  }

  return (
    <PageLayout title='Log In' titleOnly={true}>
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
                isLoading={loading}
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
