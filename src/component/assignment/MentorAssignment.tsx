/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  Text,
  useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import DownloadIcon from "~/component/assignment/DownloadIcon";
import { FolderEnum } from "~/utils/file";
import { useSession } from "next-auth/react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { TRPCClientError } from "@trpc/client";

export default function MentorAssignment() {
  const { data: session } = useSession();
  const toast = useToast();

  const assignmentListQuery = api.assignment.getAssignmentNameList.useQuery();
  const assignmentResultQuery = api.assignment.getAssignmentResult.useQuery({
    userId: session?.user.id ?? ""
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

  const handleSelectAssignment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssignment(e.target.value);
  };

  const downloadFile = async (
    title: string,
    firstName: string,
    lastName: string | null,
    filePath: string
  ) => {
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
      link.download = `${title} ${firstName} ${
        lastName ? lastName : ""
      }${filePath.slice(filePath.lastIndexOf("."))}`;

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (err: unknown) {
      if (!(err instanceof TRPCClientError)) throw err;

      toast({
        title: "Failed",
        status: "error",
        description: err.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }
  };

  // batch download file
  const batchDownload = async (
    submissions: RouterOutputs["assignment"]["getAssignmentResult"]["submissions"][number]
  ) => {
    // might be bad , soalnya nunggu satu satu.
    // kalo mentor banyak banget download bareng problem
    const zip = new JSZip();
    let count = 0;
    const zipFileName = submissions.title + ".zip";
    const filesUrl: string[] = [];
    const fileNames: string[] = [];
    for (const submission of submissions.submission) {
      if (submission.filePath) {
        // await downloadFile(submission.filePath);
        const { url } = await generateURLForDownload.mutateAsync({
          folder: FolderEnum.ASSIGNMENT,
          filename: submission.filePath
        });
        filesUrl.push(url);
        fileNames.push(
          `${submissions.title} ${submission.student.firstName} ${
            submission.student.lastName ? submission.student.lastName : ""
          }${submission.filePath.slice(submission.filePath.lastIndexOf("."))}`
        );
      }
    }

    filesUrl.forEach(async function (url, i) {
      console.log(i);
      const name = fileNames[i];
      const file = await fetch(url);
      const fileBlob = await file.blob();
      zip.file(name!, fileBlob, { binary: true });
      count++;
      if (count === filesUrl.length) {
        void zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(content, zipFileName);
        });
      }
    });
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
          transition='all 0.2s ease-in-out'
          _hover={{
            opacity: 0.8
          }}
          css={{
            option: {
              background: "#1C939A"
            }
          }}
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

      <Flex flexDir={"column"} marginTop={10} gap={10}>
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
              >
                <TableContainer>
                  <Table variant='unstyled'>
                    <Tbody>
                      {submissions.submission.map((submission) => {
                        return (
                          <Tr key={submission.id}>
                            <Td>
                              {" "}
                              <Text fontWeight='400' fontSize='lg'>
                                {submission.student.firstName}{" "}
                                {submission.student.lastName}
                              </Text>
                            </Td>
                            <Td>
                              {" "}
                              <Text fontWeight='400' fontSize='lg'>
                                {`Kelompok ${submission.student.group.group}`}
                              </Text>
                            </Td>
                            <Td>
                              {" "}
                              {submission.filePath ? (
                                <Button
                                  bg='#1C939A'
                                  onClick={() =>
                                    downloadFile(
                                      submissions.title,
                                      submission.student.firstName,
                                      submission.student.lastName,
                                      submission.filePath!
                                    )
                                  }
                                  _hover={{
                                    opacity: 0.8
                                  }}
                                  transition='all 0.2s ease-in-out'
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

                <Box>
                  <Button
                    color='white'
                    bg={"#1C939A"}
                    size='md'
                    width='100%'
                    marginTop={[5, 5, 5, 5, 0]}
                    onClick={() => batchDownload(submissions)}
                    _hover={{
                      opacity: 0.8
                    }}
                    transition='all 0.2s ease-in-out'
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
