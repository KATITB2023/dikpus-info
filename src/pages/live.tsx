import { useSession } from "next-auth/react";
import PageLayout from "~/layout";
import { Redirect } from "~/component/Redirect";
import { UserRole } from "@prisma/client";
import { Center, Text, AspectRatio, Heading, Flex } from "@chakra-ui/react";
import { api } from "~/utils/api";

interface Props {
  liveLink: string;
  fallbackLink: string;
}

export default function Live() {
  const { data: session } = useSession();
  const youtubeQuery: Props | null | undefined =
    api.profile.getEmbedYoutubeLink.useQuery().data;

  if (!session) {
    return <Redirect />;
  }

  const role = session?.user.role;

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
        gap={7}
      >
        <Heading fontSize='2xl'>Youtube Live</Heading>
        <AspectRatio ratio={16 / 9} w={{ base: "80%", lg: "80ch" }}>
          <iframe
            src={youtubeQuery?.liveLink || youtubeQuery?.fallbackLink}
            title='YouTube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </AspectRatio>
      </Flex>
    </PageLayout>
  );
}
