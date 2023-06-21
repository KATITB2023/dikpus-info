import { useSession } from "next-auth/react";
import PageLayout from "~/layout";
import { Redirect } from "~/component/Redirect";
import { UserRole } from "@prisma/client";
import {
  Center,
  Text,
  Heading,
  Flex,
  Box,
  Button
} from "@chakra-ui/react";
import { api } from "~/utils/api";

export default function Ekskul() {
  const { data: session } = useSession();

  const getBroadcast = api.profile.getBroadcast.useQuery();

  const broadcastData = getBroadcast.data?.broadcasts;

  if (!session) return <Redirect />;

  const role = session.user.role;

  if (role === UserRole.MENTOR) {
    return (
      <Center minH='100vh'>
        <Text textAlign='center' fontSize='xl' fontFamily='SomarRounded-Bold'>
          Ini buat mentee saja ya, hehe
        </Text>
      </Center>
    );
  }

  return (
    <PageLayout title='Kelas Ekskul'>
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDir='column'
        gap={10}
      >
        <Heading fontSize='2xl' textAlign='center'>
          Informasi
        </Heading>
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDir={{ base: "column", md: "row" }}
          gap={10}
        >
          {broadcastData?.map((broadcast) => {
            return (
              <Flex
                key={broadcast.broadcastTemplate[0]}
                alignItems='center'
                justifyContent='center'
                flexDir='column'
                gap={10}
              >
                <Box
                  key={broadcast.broadcastTemplate[0]}
                  outline={"2px solid #1C939A"}
                  p={2}
                >
                  <Text
                    textAlign={"center"}
                    fontSize='lg'
                    fontFamily='SomarRounded-Bold'
                    marginBottom={2}
                  >
                    {"Kelas " + broadcast.type}
                  </Text>
                  <Text whiteSpace={"pre-wrap"}>
                    {broadcast.broadcastTemplate}
                  </Text>
                </Box>
                {broadcast.zoomLink && (
                  <Button
                    as='a'
                    href={broadcast.zoomLink}
                    target='_blank'
                    colorScheme='teal'
                  >
                    Join Zoom
                  </Button>
                )}
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </PageLayout>
  );
}
