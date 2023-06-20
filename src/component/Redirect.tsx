import { Flex, Text, Button } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";

export const Redirect = () => {
  return (
    <>
      <Head>
        <title>KAT ITB 2023</title>
      </Head>
      <Flex
        minH='100vh'
        alignItems='center'
        justifyContent='center'
        flexDir='column'
        gap={2}
        fontSize='xl'
        py={5}
        px={{ base: 7, lg: 12 }}
        textAlign='center'
      >
        <Text fontFamily='SomarRounded-Bold'>Kamu sepertinya belum login</Text>
        <Text fontSize='lg'>Login skuy :D</Text>
        <Link href={"/"}>
          <Button
            mt={6}
            bg='#1C939A'
            color='white'
            textTransform='capitalize'
            _hover={{ opacity: 0.8 }}
            transition='all 0.2 ease-in-out'
          >
            Login
          </Button>
        </Link>
      </Flex>
    </>
  );
};
