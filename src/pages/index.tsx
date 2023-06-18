import { Button } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Box } from "@chakra-ui/react";
import { UserRole } from "@prisma/client";
import { type NextPage } from "next";

export default function Home() {
  return <Button onClick={() => void signIn()}>Sign in</Button>;
}
