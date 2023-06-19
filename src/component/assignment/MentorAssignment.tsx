/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { TRPCError } from "@trpc/server";
import { type RouterOutputs, api } from "~/utils/api";
import DownloadIcon from "~/component/assignment/DownloadIcon";
import { FolderEnum } from "~/utils/file";

export default function MentorAssignment({ session }: { session: Session }) {
  const assignmentListQuery = api.assignment.getAssignmentNameList.useQuery();
  const assignmentResultQuery = api.assignment.getAssignmentResult.useQuery({
    userId: session.user.id
  });

  const assignmentList = assignmentListQuery.data;
  const assignmentResult = assignmentResultQuery.data;

  const [selectedAssignment, setSelectedAssignment] = useState<string>();
  const [filteredAssignment, setFilteredAssignment] =
    useState<RouterOutputs["assignment"]["getAssignmentResult"]>();
  const generateURLForDownload =
    api.storage.generateURLForDownload.useMutation();

  useEffect(() => {
    if (assignmentResult) {
      if (selectedAssignment) {
        const filtered = assignmentResult.submissions.filter(
          (item) => item.title === selectedAssignment
        );
        setFilteredAssignment({ submissions: filtered });
      } else {
        setFilteredAssignment(assignmentResult);
      }
    }
  }, [assignmentList, assignmentResult, selectedAssignment]);

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

  // batch download file
  const batchDownload = async (
    submissions: RouterOutputs["assignment"]["getAssignmentResult"]["submissions"][number]
  ) => {
    // might be bad , soalnya nunggu satu satu.
    // kalo mentor banyak banget download bareng problem
    for (const submission of submissions.submission) {
      if (submission.filePath) {
        await downloadFile(submission.filePath);
      }
    }
  };

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
          {assignmentList && assignmentList.length > 0
            ? assignmentList.map((assignment, index) => (
                <option key={index} value={assignment.title}>
                  {assignment.title}
                </option>
              ))
            : null}
        </Select>
      </Flex>

      <Flex flexDir={"column"} marginTop={10} gap='20'>
        {filteredAssignment?.submissions.map((submissions) => {
          return (
            <Box key={submissions.id}>
              <Box marginBottom={5}>
                <Text as='b' fontSize={["2xl", "2xl", "3xl"]}>
                  {" "}
                  {submissions.title}{" "}
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
                      {submissions.submission.map((submission) => {
                        return (
                          <Tr key={submission.id}>
                            <Td>
                              {" "}
                              <Text fontWeight='700' fontSize='xl'>
                                {submission.student.firstName}{" "}
                                {submission.student.lastName}
                              </Text>
                            </Td>
                            <Td>
                              {" "}
                              <Text fontWeight='700' fontSize='xl'>
                                {`Kelompok ${submission.student.group.group}`}
                              </Text>
                            </Td>
                            <Td>
                              {" "}
                              {submission.filePath ? (
                                <Button
                                  bg='#1C939A'
                                  onClick={() =>
                                    downloadFile(submission.filePath!)
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
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>

                <Box marginLeft={10}>
                  <Button
                    color='white'
                    bg={"#1C939A"}
                    size='md'
                    width='100%'
                    marginTop={[5, 5, 5, 5, 0]}
                    onClick={() => batchDownload(submissions)}
                  >
                    {"Download Semua"}
                    <DownloadIcon />
                  </Button>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}
