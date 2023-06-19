import { Flex, Heading, Box, IconButton } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import PageLayout from "~/layout";
import ChangePasswordForm from "~/component/ChangePasswordForm";

export default function ChangePassword() {
  return (
    <PageLayout title='Change Password' titleOnly={true}>
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
  );
}
