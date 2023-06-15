import { Flex, Img, Text, TableContainer,Table, Tbody,Tr,Td } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { string } from 'zod';
import PageLayout from '~/layout';

interface Student {
  id: string;
  gender: 0 | 1;
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

const DUMMY_STUDENT: Student = {
  id: '13522144',
  gender: 0,
  firstName: 'Muhammad',
  lastName: 'Fikri',
  fakultas: 'STEI',
  jurusan: 'IF',
  phoneNumber: '081234567890',
  imagePath: 'https://bit.ly/sage-adebayo',
  accepted: true,
  userId: '1',
  mentorId: '1'
};

export default function Profile() {
  const [student, setStudent] = useState<Student>();

  useEffect(() => {
    setStudent(DUMMY_STUDENT);
  });
  if (!student) return null;

  const StudentInformationRow = ({ title, data }: { title: string; data: string }) => {
    return <Tr>
        <Td w="5em" fontWeight="bold" px="0">{title}</Td>
        <Td>{data}</Td>
    </Tr>
  }
  return (
    <PageLayout title='Profile'>
      <Flex px='2em' flexDir='column'>
        <Flex mt='2em' justifyContent='center'>
          <Img src={student.imagePath} w='10em' h='15em' />
          <Flex flexDir='column' w="calc(100% - 10em)" ml="2em">
            <Flex justifyContent='space-between' w="100%">
              <Text fontSize='2xl' fontWeight='bold'>
                {student.firstName} {student.lastName}
              </Text>
              <MdEdit size={24} />
            </Flex>
            <Text fontSize='lg' mt="1em">{student.id}</Text>
            <TableContainer mt="1em">
                <Table variant="unstyled">
                    <Tbody>
                        <StudentInformationRow title="Jenis Kelamin" data={student.gender ? "Laki-laki" : "Perempuan"} />
                        <StudentInformationRow title="Fakultas" data={student.fakultas} />
                        <StudentInformationRow title="Jurusan" data={student.jurusan} />
                        <StudentInformationRow title="Nomor HP" data={student.phoneNumber} />
                        <StudentInformationRow title="Kelompok Mentoring" data={student.mentorId}/>
                        <StudentInformationRow title="Link Zoom" data=""/>
                    </Tbody>
                </Table>
            </TableContainer>
          </Flex>
        </Flex>
      </Flex>
    </PageLayout>
  );
}
