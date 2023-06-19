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
  Td
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { EditingModal, Student } from '~/components/profile/EditingModal';
import PageLayout from '~/layout';
import { api } from '~/utils/api';

interface ProfileBodyProps {
  id: string;
  role: string;
}

export default function ProfileBody({ id, role }: ProfileBodyProps) {
  const profileQuery = api.profile.getProfile.useQuery({ userId: id });
  const profileMutation = api.profile.editProfile.useMutation();
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') return signIn();

  const profile = profileQuery.data;

  const [student, setStudent] = useState<Student>({
    id: profile?.nim || '',
    gender: profile?.gender || '',
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    fakultas: profile?.fakultas || '',
    jurusan: profile?.jurusan || '',
    phoneNumber: profile?.phoneNumber || '',
    imagePath: profile?.imagePath || '',
    accepted: profile?.accepted || false,
    userId: profile?.userId || '',
    mentorId: profile?.mentorId || ''
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!student) return signIn();
  if (typeof student.firstName != 'string') return null;

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const StudentInformationRow = ({
    title,
    data
  }: {
    title: string;
    data: string | JSX.Element;
  }) => {
    return (
      <Tr>
        <Td w='5em' fontWeight='bold' px='0'>
          {title}
        </Td>
        <Td>{data}</Td>
      </Tr>
    );
  };

  return (
    <Flex px='2em' flexDir='column'>
      <Flex mt='2em' justifyContent='center'>
        <Img src={student.imagePath} w='10em' h='15em' />
        <Flex flexDir='column' w='calc(100% - 10em)' ml='2em'>
          <Flex justifyContent='space-between' w='100%'>
            <Text fontSize='2xl' fontWeight='bold'>
              {student.firstName} {student.lastName}
            </Text>
            <MdEdit size={24} onClick={toggleEditing} cursor='pointer' />
            <EditingModal
              isOpen={isEditing}
              student={student}
              setStudent={setStudent}
              toggleEditing={toggleEditing}
            />
          </Flex>
          <Text fontSize='lg' mt='1em'>
            {student.id}
          </Text>
          <TableContainer mt='1em'>
            <Table variant='unstyled'>
              <Tbody>
                <StudentInformationRow
                  title='Jenis Kelamin'
                  data={student.gender}
                />
                <StudentInformationRow
                  title='Fakultas'
                  data={student.fakultas}
                />
                <StudentInformationRow title='Jurusan' data={student.jurusan} />
                <StudentInformationRow
                  title='Nomor HP'
                  data={student.phoneNumber}
                />
                <StudentInformationRow
                  title='Kelompok Mentoring'
                  data={student.mentorId}
                />
                <StudentInformationRow title='Link Zoom' data='' />
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Flex>
    </Flex>
  );
}
