import { Flex, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';

export const RedirectLogin = () => {
  return (
    <Flex
      minH='100vh'
      alignItems='center'
      justifyContent='center'
      flexDir='column'
      gap={1}
      fontSize='xl'
    >
      <Text>Kamu belum login nih</Text>
      <Text>Coba untuk login dlu ya :D</Text>
      <Link href='/'>
        <Button
          bg='#1C939A'
          borderRadius={0}
          _hover={{ opacity: 0.8 }}
          transition='all 0.2s ease-in-out'
          fontStyle='normal'
          color='white'
          mt={5}
        >
          Login
        </Button>
      </Link>
    </Flex>
  );
};
