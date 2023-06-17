import { Button } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

export default function Home() {
  return <Button onClick={() => void signIn()}>Sign in</Button>;
}
