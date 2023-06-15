import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { api } from '~/utils/api';
import AssignmentMenteeSidePage from './assigment-mentee-side';
import PageLayout from '../../layout/index';

export default function Home() {
  return (
    <PageLayout
      title={'Tugas'}
      // eslint-disable-next-line react/no-children-prop
      children={<AssignmentMenteeSidePage></AssignmentMenteeSidePage>}
    ></PageLayout>
  );
}
