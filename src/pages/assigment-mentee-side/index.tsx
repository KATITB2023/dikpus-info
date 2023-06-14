import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { api } from '~/utils/api';
import AssigmentMenteeSidePage from './assigment-mentee-side';

export default function Home() {
  return <AssigmentMenteeSidePage />;
}
