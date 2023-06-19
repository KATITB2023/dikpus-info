import {
  Flex,
  Img,
  Text,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { EditingModal } from "~/component/profile/EditingModal";
import { api } from "~/utils/api";

interface ProfileBodyProps {
  id: string;
}

export default function ProfileBody({ id }: ProfileBodyProps) {
  const profileQuery = api.profile.getProfile.useQuery({ userId: id });
  const { status } = useSession();

  if (status === "unauthenticated") return signIn();

  const student = profileQuery.data;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!student) return null;
  if (typeof student.firstName != "string") return null;

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
    if (!data) return null;
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
        {student.imagePath ? (
          <Img src={student.imagePath} w='10em' h='15em' />
        ) : (
          <Flex
            justifyContent='center'
            alignItems='center'
            w='10em'
            h='15em'
            bg='gray'
            onClick={toggleEditing}
            cursor='pointer'
          >
            {" "}
            Tambahkan Foto{" "}
          </Flex>
        )}
        <Flex flexDir='column' w='calc(100% - 10em)' ml='2em'>
          <Flex justifyContent='space-between' w='100%'>
            <Text fontSize='2xl' fontWeight='bold'>
              {student.firstName} {student.lastName}
            </Text>
            <MdEdit size={24} onClick={toggleEditing} cursor='pointer' />
            <EditingModal
              isOpen={isEditing}
              toggleEditing={toggleEditing}
              initialState={{
                userId: student.userId,
                firstName: student.firstName,
                lastName: student.lastName,
                phoneNumber: student.phoneNumber || "",
                imageUrl: student.imagePath || ""
              }}
            />
          </Flex>
          <Text fontSize='lg' mt='1em'>
            {student.nim}
          </Text>
          <TableContainer mt='1em'>
            <Table variant='unstyled'>
              <Tbody>
                <StudentInformationRow
                  title='Jenis Kelamin'
                  data={student.gender || "Belum ada data"}
                />
                <StudentInformationRow
                  title='Fakultas'
                  data={student.fakultas}
                />
                <StudentInformationRow title='Jurusan' data={student.jurusan} />
                <StudentInformationRow
                  title='Nomor HP'
                  data={student.phoneNumber || "Belum ada data"}
                />
                <StudentInformationRow
                  title='Kelompok Mentoring'
                  data={student.mentorId}
                />
                <StudentInformationRow title='Link Zoom' data={<Link href={student.group?.zoomLink}>{student.group?.zoomLink}</Link>} />
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Flex>
    </Flex>
  );
}
