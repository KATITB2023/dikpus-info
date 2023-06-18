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

export default function MentorAssignment() {
  //dummy data
  //TODO : change with actual TRPC

  //dummy data still not accurate with the response object
  //will tweak later

  const [assignment, setAssignment] = useState([
    {
      id: 1,
      name: 'Tugas Mengenali Diri Sendiri'
    },
    {
      id: 2,
      name: 'Tugas Menjahili Orang'
    },
    {
      id: 3,
      name: 'Tugas Dikpus Nyusahin'
    }
  ]);

  const [group, setGroup] = useState([
    {
      id: 1,
      name: 'Kelompok 1'
    },
    {
      id: 2,
      name: 'Kelompok 2'
    },
    {
      id: 3,
      name: 'Kelompok 3'
    }
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Andhika Arta',
      kelompok: 'Z',
      isSubmitted: true
    },
    {
      id: 2,
      name: 'Malakan Bakbak',
      kelompok: 'X',
      isSubmitted: false
    },
    {
      id: 3,
      name: 'Testing',
      kelompok: 'Z',
      isSubmitted: true
    }
  ]);


  const { data: session } = useSession();
  const assignments = api.assignment.getAssignmentNameList.useQuery().data;
  const assignmentResult = api.assignment.getAssignmentResult.useQuery({userId: session?.user.id ?? ''}).data;
  
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [filteredAssignment, setFilteredAssignment] = useState([]);

  const handleSelectAssignment = (e: any) => {
    setSelectedAssignment(e.target.value);
  };

  useEffect(() => {
    //group assignmentResult based on assignmentId
    const groupedAssignmentResult = assignmentResult?.reduce((acc: any, curr: any) => {
      if(!acc[curr.assignmentId]){
        acc[curr.assignmentId] = [];
      }
      acc[curr.assignmentId].push(curr);
      return acc;
    }
    ,{});
  }, [assignments, assignmentResult]);

  return (
    <Box>
      <Flex gap={10} w={['50%', '40%', '30%', '20%', '15%']}>
        <Select
          placeholder='Pilih tugas'
          variant='filled'
          bg={'#1C939A'}
          color={'white'}
          onChange={handleSelectAssignment}
        >
          {assignments?.map((item) => (
            <option value={item.title}>{item.title}</option>
          ))}
        </Select>
      </Flex>

      <Flex flexDir={'column'} marginTop={10} gap='20'>
        {assignment.map((item) => (
          <Box>
            <Box marginBottom={5}>
              <Text as='b' fontSize={['2xl', '2xl', '3xl']}>
                {' '}
                {item.name}{' '}
              </Text>
            </Box>

            <Flex
              justifyContent='space-between'
              flexDir={['column', 'column', 'column', 'column', 'row']}
              w='80%'
            >
              <TableContainer>
                <Table variant='unstyled'>
                  <Tbody>
                    {students.map((student) => (
                      <Tr>
                        <Td>
                          {' '}
                          <Text fontWeight='700' fontSize='xl'>
                            {student.name}{' '}
                          </Text>
                        </Td>
                        <Td>
                          {' '}
                          <Text fontWeight='700' fontSize='xl'>
                            Kelompok {student.kelompok}
                          </Text>
                        </Td>
                        <Td>
                          {' '}
                          {student.isSubmitted ? (
                            <DownloadIcon />
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
                <Button variant='outline' bg={'#1C939A'} size='md' width='100%'>
                  Download Semua   
                  <DownloadIcon/>
                </Button>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
