import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Home() {
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
      >
        <Text>KAT 2023: Diklat Terpusat</Text>
        <Text>
          <b>Coming Soon</b>
        </Text>
      </Flex>
    </>
  );
}
