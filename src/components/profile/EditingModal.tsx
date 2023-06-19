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
  TagLabel
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { set } from 'zod';
import { api } from '~/utils/api';
import { FolderEnum, AllowableFileTypeEnum, uploadFile } from '~/utils/file';

export interface Student {
  id: string;
  gender: string
  firstName: string;
  lastName: string;
  fakultas: string;
  jurusan: string;
  phoneNumber: string;
  imagePath: string;
  accepted: boolean;
  userId: string;
  mentorId: string;
}

interface EditingModalProps {
  isOpen: boolean;
  student: Student;
  setStudent: (student: Student) => void;
  toggleEditing: () => void;
}

export const EditingModal = ({
  isOpen,
  student,
  toggleEditing,
  setStudent
}: EditingModalProps) => {
  const [firstName, setFirstName] = useState<string>(student.firstName);
  const [lastName, setLastName] = useState<string>(student.lastName);
  const [phoneNumber, setPhoneNumber] = useState<string>(student.phoneNumber);
  const profileMutation = api.profile.editProfile.useMutation();
  const generateURLForUpload = api.storage.generateURLForUpload.useMutation()

  const [isEditingProfilePic, setIsEditingProfilePic] = 
    useState<boolean>(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);


  const save = async () => {
    if (!profilePic) return
    const {url: uploadURL,sanitizedFilename} = await  generateURLForUpload.mutateAsync({
      folder: FolderEnum.PROFILE,
      filename: `${student.id}.png`,
      contentType: AllowableFileTypeEnum.PNG
    })

    await uploadFile(uploadURL, profilePic,AllowableFileTypeEnum.PNG)

    profileMutation.mutate({
      userId: student.id,
      firstName,
      lastName,
      phoneNumber,
      profile_url: uploadURL
    })

    setStudent({
      ...student,
      firstName,
      lastName,
      phoneNumber,
      imagePath: profilePic
        ? uploadURL
        : student.imagePath
    });
    toggleEditing();
  };

  const profilePicChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setProfilePic(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const profilePicClicker = () => {
    if (profilePicRef.current) profilePicRef.current.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='black'>Edit Profile</ModalHeader>
        <ModalCloseButton />
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
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Nama Belakang</Td>
                  <Td>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Nomor Telepon</Td>
                  <Td>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
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
            ) : (
              <Img
                src={student.imagePath}
                w='100px'
                h='100px'
                borderRadius='50%'
                objectFit='cover'
              />
            )}
            <Input
              type='file'
              ref={profilePicRef}
              onChange={profilePicChangeHandler}
              display='none'
            />
            <Button mt='1em' variant='ghost' onClick={profilePicClicker}>
              Unggah Foto Profil
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' onClick={toggleEditing} mr='1em'>
            Batal
          </Button>
          <Button colorScheme='blue' mr={3} onClick={save}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
