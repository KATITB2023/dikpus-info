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
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import DownloadIcon from "./DownloadIcon";
import { FolderEnum } from "~/utils/file";
import { TRPCError } from "@trpc/server";

export default function MentorAssignment() {
  const { data: session } = useSession();
  const assignments = api.assignment.getAssignmentNameList.useQuery().data;
  const assignmentResult = api.assignment.getAssignmentResult.useQuery({
    userId: session?.user.id ?? ""
  }).data;
  const generateURLForDownload =
    api.storage.generateURLForDownload.useMutation();
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [filteredAssignment, setFilteredAssignment] =
    useState<RouterOutputs["assignment"]["getAssignmentResult"]>();

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

  //batch download file
  const batchDownload = async (item: any) => {
    // might be bad , soalnya nunggu satu satu.
    // kalo mentor banyak banget download bareng problem
    for (let i = 0; i < item.submission.length; i++) {
      if (item.submission[i].filePath) {
        await downloadFile(item.submission[i].filePath);
      }
    }
  };

  useEffect(() => {
    if (assignmentResult) {
      if (selectedAssignment != "") {
        const filtered = assignmentResult.submissions.filter(
          (item) => item.title === selectedAssignment
        );
        setFilteredAssignment({ submissions: filtered });
      } else {
        setFilteredAssignment(assignmentResult);
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
          {assignments?.map((item, index: number) => (
            <option key={index} value={item.title}>
              {item.title}
            </option>
          ))}
        </Select>
      </Flex>

      <Flex flexDir={"column"} marginTop={10} gap='20'>
        {filteredAssignment?.submissions.map((item, index: number) => (
          <Box key={index}>
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
                    {item.submission.map((submission, index: number) => (
                      <Tr key={index}>
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
                            {`Kelompok ${submission.student.group.group}`}
                          </Text>
                        </Td>
                        <Td>
                          {" "}
                          {submission.filePath ? (
                            <Button
                              bg='#1C939A'
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
                  color='white'
                  bg={"#1C939A"}
                  size='md'
                  width='100%'
                  marginTop={[5, 5, 5, 5, 0]}
                  onClick={() => void batchDownload(item)}
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
