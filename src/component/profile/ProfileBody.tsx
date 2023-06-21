import {
  Flex,
  Img,
  Text,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Box
} from "@chakra-ui/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { EditingModal } from "~/component/profile/EditingModal";
import { api } from "~/utils/api";
import { FolderEnum } from "~/utils/file";

interface ProfileBodyProps {
  id: string;
}

export default function ProfileBody({ id }: ProfileBodyProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const profileQuery = api.profile.getProfile.useQuery({ userId: id });
  const generateURLForDownload =
    api.storage.generateURLForDownload.useMutation();

  const student = profileQuery.data;
  const imagePath = student?.imagePath;
  const downloadMutate = generateURLForDownload.mutate;

  const fetchData = useCallback(() => {
    // Fetch data logic
    if (!imagePath) return;

    downloadMutate({
      folder: FolderEnum.PROFILE,
      filename: imagePath
    });
  }, [imagePath, downloadMutate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!student) return null;

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
    <Flex flexDir='column'>
      <Flex
        justifyContent={{ base: "center", lg: "flex-start" }}
        flexDir={{ base: "column", lg: "row" }}
        gap={{ base: 5, lg: 12 }}
      >
        {student.imagePath ? (
          <Img src={generateURLForDownload.data?.url} w='10em' h='15em' />
        ) : (
          <Flex
            justifyContent='center'
            alignItems='center'
            alignSelf='center'
            w='10em'
            h='15em'
            bg='#1C939A'
            onClick={toggleEditing}
            cursor='pointer'
          >
            {" "}
            Tambahkan Foto{" "}
          </Flex>
        )}
        <Flex flexDir='column' w={{ base: "100%", lg: "calc(100% - 10em)" }}>
          <Flex justifyContent='space-between' w='100%'>
            <Text fontSize='2xl' fontWeight='bold'>
              {student.firstName} {student.lastName}
            </Text>
            <Box alignSelf='center'>
              <MdEdit size={24} onClick={toggleEditing} cursor='pointer' />
            </Box>
            <EditingModal
              isOpen={isEditing}
              toggleEditing={toggleEditing}
              initialState={{
                userId: student.userId,
                firstName: student.firstName,
                lastName: student.lastName || "",
                phoneNumber: student.phoneNumber || "",
                imageUrl: generateURLForDownload.data?.url
              }}
            />
          </Flex>
          <Text fontSize='lg' mt='1em'>
            {student.user && student.user.nim}
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
                <StudentInformationRow
                  title='Nomor HP'
                  data={student.phoneNumber || "Belum ada data"}
                />
                <StudentInformationRow
                  title='Kelompok Mentoring'
                  data={
                    student.group
                      ? student.group.group.toString()
                      : "Belum ada data"
                  }
                />
                <StudentInformationRow
                  title='Link Zoom'
                  data={
                    student.group ? (
                      <Link href={student.group.zoomLink} target='_blank'>
                        {student.group?.zoomLink}
                      </Link>
                    ) : (
                      "Belum ada data"
                    )
                  }
                />
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Flex>
    </Flex>
  );
}
