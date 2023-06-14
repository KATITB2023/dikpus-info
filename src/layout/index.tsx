import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title} - KAT ITB 2023</title>
      </Head>
      <Navbar title={title} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Box minH='100vh' px={12} pt={5}>
          {children}
        </Box>
      </motion.div>
    </>
  );
}
