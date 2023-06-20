import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>404 - KAT ITB 2023</title>
      </Head>
      <Flex
        minH='100vh'
        alignItems='center'
        justifyContent='center'
        flexDir='column'
        gap={2}
        fontSize='xl'
        px={{ base: 7, lg: 12 }}
        py={5}
        textAlign='center'
      >
        <Text fontFamily='SomarRounded-Bold'>
          Aduh, halaman yang kamu cari nggak ada nih
        </Text>
        <Text fontSize='lg'>
          Coba cek lagi <b>URL</b>-nya ya :)
        </Text>
      </Flex>
    </>
  );
};

export default NotFoundPage;
