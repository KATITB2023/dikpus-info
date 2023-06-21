import {
  Flex,
  Img,
  Button,
  TableContainer,
  Table,
  Input,
  Tbody,
  Tr,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Avatar,
  Spinner,
  useDisclosure
} from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { api } from "~/utils/api";
import { FolderEnum, AllowableFileTypeEnum, uploadFile } from "~/utils/file";

interface EditingModalProps {
  isOpen: boolean;
  initialState: {
    userId: string;
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
    imageUrl?: string;
  };
  toggleEditing: () => void;
}

export const EditingModal = ({
  isOpen,
  toggleEditing,
  initialState
}: EditingModalProps) => {
  const toast = useToast();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(initialState.firstName);
  const [lastName, setLastName] = useState<string | undefined>(
    initialState.lastName
  );
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(
    initialState.phoneNumber
  );
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    initialState.imageUrl
  );
  const { onClose } = useDisclosure();

  const profileMutation = api.profile.editProfile.useMutation();
  const generateURLForUpload = api.storage.generateURLForUpload.useMutation();

  const router = useRouter();

  const profilePicRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const save = async () => {
    setIsUploading(true);
    let newImageUrl = initialState.imageUrl;

    try {
      if (profilePic) {
        const { url: uploadURL, sanitizedFilename } =
          await generateURLForUpload.mutateAsync({
            folder: FolderEnum.PROFILE,
            filename: `${initialState.userId}.png`,
            contentType: AllowableFileTypeEnum.PNG
          });

        await uploadFile(uploadURL, profilePic, AllowableFileTypeEnum.PNG);

        newImageUrl = sanitizedFilename;
      } else {
        newImageUrl = imageUrl;
      }

      const res = await profileMutation.mutateAsync({
        userId: initialState.userId,
        firstName,
        lastName,
        phoneNumber,
        profileURL: newImageUrl
      });

      toast({
        title: "Success",
        status: "success",
        description: res.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    } catch (e: unknown) {
      if (!(e instanceof TRPCClientError)) throw e;

      toast({
        title: "Failed",
        status: "error",
        description: e.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }

    toggleEditing();
    setIsUploading(false);
    setTimeout(() => {
      router.reload();
    }, 1400);
  };

  const profilePicChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setProfilePic(e.target.files[0]);
  };

  const profilePicClicker = () => {
    if (profilePicRef.current) profilePicRef.current.click();
  };

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg='#1C939A' color='white'>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton onClick={toggleEditing} />
        <ModalBody>
          <TableContainer>
            <Table size='sm'>
              <Tbody>
                <Tr>
                  <Td className='modal-row'>Nama Depan</Td>
                  <Td>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      border='1px solid white'
                      fontSize='sm'
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td className='modal-row'>Nama Belakang</Td>
                  <Td>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      border='1px solid white'
                      fontSize='sm'
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td className='modal-row'>Nomor Telepon</Td>
                  <Td>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      border='1px solid white'
                      fontSize='sm'
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Flex
            w='100%'
            justifyContent='center'
            mt={5}
            flexDir='column'
            alignItems='center'
          >
            {profilePic ? (
              <Img
                src={URL.createObjectURL(profilePic)}
                w='100px'
                h='100px'
                borderRadius='50%'
                objectFit='cover'
              />
            ) : imageUrl ? (
              <Img
                src={imageUrl}
                w='100px'
                h='100px'
                borderRadius='50%'
                objectFit='cover'
              />
            ) : (
              <Avatar w='80px' h='80px' />
            )}
            <Input
              type='file'
              ref={profilePicRef}
              onChange={profilePicChangeHandler}
              display='none'
            />
            <Flex w='100%' justifyContent='space-evenly'>
              <Button
                mt='1em'
                variant='solid'
                colorScheme='blue'
                onClick={profilePicClicker}
                fontSize='sm'
              >
                Unggah Foto Profil
              </Button>
              <Button
                mt='1em'
                variant='solid'
                color='white'
                bg='red.500'
                onClick={() => {
                  setProfilePic(null);
                  setImageUrl("");
                }}
                fontSize='sm'
              >
                Hapus Foto Profil
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            color='white'
            bg='red.500'
            onClick={toggleEditing}
            mr='1em'
          >
            Batal
          </Button>
          <Button colorScheme='blue' mr={3} onClick={() => void save()} w='5em'>
            {isUploading ? <Spinner /> : "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
