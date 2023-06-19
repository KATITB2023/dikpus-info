import {
  Flex,
  Img,
  Text,
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
  TagLabel,
  useToast,
  Avatar,
  Spinner
} from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { set } from "zod";
import { RouterInputs, RouterOutputs, api } from "~/utils/api";
import { FolderEnum, AllowableFileTypeEnum, uploadFile } from "~/utils/file";

interface EditingModalProps {
  isOpen: boolean;
  initialState: {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    imageUrl: string;
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
  const [lastName, setLastName] = useState<string>(initialState.lastName);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    initialState.phoneNumber
  );
  const [imageUrl, setImageUrl] = useState<string>(initialState.imageUrl);

  const profileMutation = api.profile.editProfile.useMutation();
  const generateURLForUpload = api.storage.generateURLForUpload.useMutation();
  const generateURLForDownload =
    api.storage.generateURLForDownload.useMutation();

  const router = useRouter()

  const profilePicRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const save = async () => {
    setIsUploading(true);
    let newImageUrl = initialState.imageUrl;

    if (profilePic) {
      const { url: uploadURL, sanitizedFilename } =
        await generateURLForUpload.mutateAsync({
          folder: FolderEnum.PROFILE,
          filename: `${initialState.userId}.png`,
          contentType: AllowableFileTypeEnum.PNG
        });

      const { url: downloadURL } = await generateURLForDownload.mutateAsync({
        folder: FolderEnum.PROFILE,
        filename: sanitizedFilename
      });

      await uploadFile(uploadURL, profilePic, AllowableFileTypeEnum.PNG);
      newImageUrl = downloadURL;
    } else {
      newImageUrl = imageUrl
    }

    try {
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
      router.reload()
    }, 1400)
  };

  const profilePicChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setProfilePic(e.target.files[0]);
  };

  const profilePicClicker = () => {
    if (profilePicRef.current) profilePicRef.current.click();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='black'>Edit Profile</ModalHeader>
        <ModalCloseButton color='black' onClick={toggleEditing} />
        <ModalBody>
          <TableContainer>
            <Table>
              <Tbody color='black'>
                <Tr>
                  <Td>Nama Depan</Td>
                  <Td>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      border='1px solid black'
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Nama Belakang</Td>
                  <Td>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      border='1px solid black'
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Nomor Telepon</Td>
                  <Td>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      border='1px solid black'
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
              <Avatar w='100px' h='100px' />
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
              >
                Unggah Foto Profil
              </Button>
              <Button
                mt='1em'
                variant='solid'
                bg='salmon'
                onClick={() => {
                  setProfilePic(null);
                  setImageUrl("");
                }}
              >
                Hapus Foto Profil
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' onClick={toggleEditing} mr='1em'>
            Batal
          </Button>
          <Button colorScheme='blue' mr={3} onClick={save} w='5em'>
            {isUploading ?  <Spinner/>: "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
