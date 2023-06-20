import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  useToast,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/router";
import { TRPCClientError } from "@trpc/client";

export default function ChangeZoomLinkForm() {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const currentZoomLink = api.profile.getZoomLink.useQuery({
    userId: session?.user.id ?? ""
  });
  const editZoomMutation = api.profile.editZoomLink.useMutation();

  const [zoomLink, setZoomLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isError = zoomLink === "";

  const handleRedirect = () => {
    const role = session?.user.role;
    role === UserRole.MENTOR
      ? void router.push("/attendance")
      : void router.push("/assignment");
  };

  const handleZoomLinkChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => setZoomLink(e.target.value);

  const handleSubmitZoomLink = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await editZoomMutation.mutateAsync({
        userId: session?.user.id ?? "",
        zoomLink
      });

      toast({
        title: "Success",
        status: "success",
        description: res.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });

      handleRedirect();
    } catch (error: unknown) {
      if (!(error instanceof TRPCClientError)) throw error;

      toast({
        title: "Failed",
        status: "error",
        description: error.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }
    setLoading(false);
  };

  return (
    <form>
      <Flex flexDir='column' alignItems='center' justifyContent='center'>
        <Text fontSize='lg'>Current Zoom Link</Text>
        <Text fontFamily='SomarRounded-Bold' fontSize='xl'>
          {currentZoomLink.data?.zoomLink}
        </Text>
      </Flex>
      <FormControl my={6}>
        <FormLabel>New Zoom Link</FormLabel>
        <Input value={zoomLink} onChange={handleZoomLinkChange} isRequired />
      </FormControl>
      <Flex justify='center'>
        <Button
          colorScheme='teal'
          type='submit'
          my={4}
          _hover={{ bg: "#72D8BA" }}
          onClick={(e) => void handleSubmitZoomLink(e)}
          isDisabled={isError}
          isLoading={loading}
        >
          Submit
        </Button>
      </Flex>
    </form>
  );
}
