import {
  Box,
  Flex,
  Select,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Button,
  Text
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import DownloadIcon from "./DownloadIcon";
import { FolderEnum } from "~/utils/file";
import { TRPCError } from "@trpc/server";

interface Submissions {
  description: string | null;
  id: string;
  title: string;
  submission: Submission[];
}

interface Submission {
  id: string;
  filePath: string | null;
  student: Student;
}

interface Student {
  fakultas: string;
  firstName: string;
  group: Group;
  id: string;
  jurusan: string;
  lastName: string;
}

interface Group {
  id: string;
  group?: number;
}

export default function MentorAssignment() {
  const { data: session } = useSession();
  const assignments = api.assignment.getAssignmentNameList.useQuery().data;
  const assignmentResult = api.assignment.getAssignmentResult.useQuery({
    userId: session?.user.id ?? ""
  }).data;
  const generateURLForDownload =
    api.storage.generateURLForDownload.useMutation();
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [filteredAssignment, setFilteredAssignment] = useState<Submissions[]>(
    []
  );

  const handleSelectAssignment = (e: any) => {
    setSelectedAssignment(e.target.value);
  };

  const downloadFile = async (filePath: string) => {
    try {
      const { url } = await generateURLForDownload.mutateAsync({
        folder: FolderEnum.ASSIGNMENT,
        filename: filePath
      });

      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filePath;

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (err: unknown) {
      if (!(err instanceof TRPCError)) throw err;
    }
  };

  useEffect(() => {
    if (assignmentResult) {
      if (selectedAssignment != "") {
        assignmentResult.submissions
          .filter((item) => item.title === selectedAssignment)
          .map((item) => {
            setFilteredAssignment([item]);
          });
      } else {
        setFilteredAssignment(assignmentResult.submissions);
      }
    }
  }, [assignments, assignmentResult, selectedAssignment]);

  return (
    <Box>
      <Flex gap={10} w={["50%", "40%", "30%", "20%", "15%"]}>
        <Select
          placeholder='Pilih tugas'
          variant='filled'
          bg={"#1C939A"}
          color={"white"}
          onChange={handleSelectAssignment}
        >
          {assignments?.map((item) => (
            <option value={item.title}>{item.title}</option>
          ))}
        </Select>
      </Flex>

      <Flex flexDir={"column"} marginTop={10} gap='20'>
        {filteredAssignment.map((item) => (
          <Box>
            <Box marginBottom={5}>
              <Text as='b' fontSize={["2xl", "2xl", "3xl"]}>
                {" "}
                {item.title}{" "}
              </Text>
            </Box>

            <Flex
              justifyContent='space-between'
              flexDir={["column", "column", "column", "column", "row"]}
              w='80%'
            >
              <TableContainer>
                <Table variant='unstyled'>
                  <Tbody>
                    {item.submission.map((submission) => (
                      <Tr>
                        <Td>
                          {" "}
                          <Text fontWeight='700' fontSize='xl'>
                            {submission.student.firstName +
                              " " +
                              submission.student.lastName}{" "}
                          </Text>
                        </Td>
                        <Td>
                          {" "}
                          <Text fontWeight='700' fontSize='xl'>
                            {"Kelompok " + submission.student.group.group}
                          </Text>
                        </Td>
                        <Td>
                          {" "}
                          {submission.filePath ? (
                            <Button
                              onClick={() =>
                                void downloadFile(submission.filePath!)
                              }
                            >
                              <DownloadIcon />
                            </Button>
                          ) : (
                            <Text fontWeight='400'>
                              {"tidak mengumpulkan tugas"}
                            </Text>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Box marginLeft={10}>
                <Button
                  variant='outline'
                  bg={"#1C939A"}
                  size='md'
                  width='100%'
                  marginTop={[5, 5, 5, 5, 0]}
                >
                  {"Download Semua"}
                  <DownloadIcon />
                </Button>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
