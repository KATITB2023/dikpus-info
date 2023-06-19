import { Flex, Heading, Box, IconButton } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import PageLayout from "~/layout";
import ChangePasswordForm from "~/component/ChangePasswordForm";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}

export default function ChangePassword({
  session
}: InferGetServerSidePropsType<typeof getSelection>) {
  return (
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
          <ChangePasswordForm session={session} />
        </Box>
      </Flex>
    </PageLayout>
  );
}
