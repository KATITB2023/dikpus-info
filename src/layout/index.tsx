import { Box } from "@chakra-ui/react";
import Head from "next/head";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

interface Props {
  title: string;
  titleOnly?: boolean;
  children: React.ReactNode;
}

export default function PageLayout({
  title,
  titleOnly = false,
  children
}: Props) {
  return (
    <>
      <Head>
        <title>{`${title} - KAT ITB 2023`}</title>
      </Head>
      <Navbar title={title} titleOnly={titleOnly} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Box px={{ base: 7, lg: 12 }} py={5}>
          {children}
        </Box>
      </motion.div>
    </>
  );
}
