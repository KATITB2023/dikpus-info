import { useSession } from "next-auth/react";
import PageLayout from "~/layout";
import { Redirect } from "~/component/Redirect";
import { UserRole } from "@prisma/client";
import { Center, Text, AspectRatio, Heading, Flex } from "@chakra-ui/react";
import { api } from "~/utils/api";

export default function Live() {
  const { data: session } = useSession();
  const getEmbedYoutubeLink = api.profile.getEmbedYoutubeLink.useQuery();

  const youtubeData = getEmbedYoutubeLink.data;

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
    <PageLayout title='Live'>
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDir='column'
        gap={10}
      >
        <Heading fontSize='2xl' textAlign='center'>
          Youtube Live
        </Heading>
        <AspectRatio ratio={16 / 9} w={{ base: "80%", lg: "90ch" }}>
          <iframe
            src={youtubeData?.liveLink || youtubeData?.fallbackLink}
            title='YouTube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </AspectRatio>
      </Flex>
    </PageLayout>
  );
}
