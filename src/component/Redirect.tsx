import { Flex, Text, Button } from "@chakra-ui/react";
import Link from "next/link";

export const Redirect = () => {
  return (
    <Flex
      minH='100vh'
      alignItems='center'
      justifyContent='center'
      flexDir='column'
      gap={1}
      fontSize='xl'
    >
      <Text fontFamily='SomarRounded-Bold'>Kamu sepertinya belum login</Text>
      <Text>Login skuy :D</Text>
      <Link href={"/"}>
        <Button
          mt={4}
          bg='#1C939A'
          color='white'
          textTransform='capitalize'
          borderRadius={0}
          _hover={{ opacity: 0.8 }}
          transition='all 0.2 ease-in-out'
        >
          Login
        </Button>
      </Link>
    </Flex>
  );
};
