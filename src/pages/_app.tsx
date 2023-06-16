import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { api } from '~/utils/api';
import '~/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Attendance } from './attendance';
import theme from '~/styles/theme';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        {/* <Component {...pageProps} /> */}
        <Attendance />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
