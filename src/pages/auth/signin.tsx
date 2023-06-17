import { getCsrfToken } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';

interface SignInProps {
  csrfToken: string;
}

export default function SignIn({ csrfToken }: SignInProps) {
  return (
    <form method='post' action='/api/auth/callback/credentials'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
      <label>
        Nim
        <input name='nim' type='text' />
      </label>
      <label>
        Password
        <input name='password' type='password' />
      </label>
      <button type='submit'>Sign in</button>
    </form>
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
