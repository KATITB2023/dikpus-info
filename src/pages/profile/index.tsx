import { Flex, Img, Text, Button, TableContainer,Table, Input, Tbody,Tr,Td } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { EditingModal, Student } from '~/components/profile/EditingModal';
import PageLayout from '~/layout';

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
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    // TO DO : nembak BE
    setStudent(DUMMY_STUDENT);
  },[]);
  if (!student) return null;

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  }

  const StudentInformationRow = ({ title, data }: { title: string; data: string | JSX.Element }) => {
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
              <MdEdit size={24} onClick={toggleEditing} cursor="pointer"/>
              <EditingModal isOpen={isEditing} student={student} setStudent={setStudent} toggleEditing={toggleEditing} />
            </Flex>
            <Text fontSize='lg' mt="1em">{student.id}</Text>
            <TableContainer mt="1em">
                <Table variant="unstyled">
                    <Tbody>
                        <StudentInformationRow title="Jenis Kelamin" data={student.gender ? "Perempuan" : "Laki-laki"} />
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
