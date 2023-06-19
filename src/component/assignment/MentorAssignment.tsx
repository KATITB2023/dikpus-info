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
} from '@chakra-ui/react';
import Head from 'next/head';
import PageLayout from '~/layout';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import DownloadIcon from './DownloadIcon';

interface Submissions {
  description: string | null;
  id : string;
  title: string;
  submission: Submission[];
}

interface Submission {
  id: string;
  filePath: string | null;
  student : Student;
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
  name?: string;
}

export default function MentorAssignment() {

  const { data: session } = useSession();
  const assignments = api.assignment.getAssignmentNameList.useQuery().data;
  const assignmentResult = api.assignment.getAssignmentResult.useQuery({userId: session?.user.id ?? ''}).data;
  
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [filteredAssignment, setFilteredAssignment] = useState<Submissions[]>([]);

  const handleSelectAssignment = (e: any) => {
    setSelectedAssignment(e.target.value);
  };

  useEffect(() => {
    if(assignmentResult) {
      if(selectedAssignment != '') {
        
        assignmentResult.submissions.filter((item) => item.title === selectedAssignment).map((item) => {
          
          setFilteredAssignment([item]);
        }
        )
      }
      else {
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
                            {submission.student.firstName + " " + submission.student.lastName}{" "}
                          </Text>
                        </Td>
                        <Td>
                          {" "}
                          <Text fontWeight='700' fontSize='xl'>
                            Kelompok {submission.student.group.name}
                          </Text>
                        </Td>
                        <Td>
                          {" "}
                          {submission.filePath ? (
                            <Button >
                              <DownloadIcon />
                            </Button>
                          ) : (
                            <Text fontWeight='400'>
                              tidak mengumpulkan tugas
                            </Text>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Box marginLeft={10}>
                <Button variant='outline' bg={"#1C939A"} size='md' width='100%' marginTop={[5,5,5,5,0]}>
                  Download Semua
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
