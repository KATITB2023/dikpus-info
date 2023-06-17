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
import { useState } from 'react'
import {api} from '~/utils/api'

export default function AssignmentMentorSide() {


  //dummy data
  //TODO : change with actual TRPC 


  //dummy data still not accurate with the response object
  //will tweak later
  
  const [assignment, setAssignment] = useState([
    {
      id: 1,
      name: "Tugas Mengenali Diri Sendiri",
    },
    {
      id: 2,
      name: "Tugas Menjahili Orang",
    },
    {
      id: 3,
      name: "Tugas Dikpus Nyusahin",
    },
  ])

  const [group, setGroup] = useState([
    {
      id: 1,
      name: "Kelompok 1",
    },
    {
      id: 2,
      name: "Kelompok 2",
    },
    {
      id: 3,
      name: "Kelompok 3",
    },
  ])

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Andhika Arta",
      kelompok: "Z",
      isSubmitted: true,
    },
    {
      id: 2,
      name: "Malakan Bakbak",
      kelompok: "X",
      isSubmitted: false,
    },
    {
      id: 3,
      name: "Testing",
      kelompok: "Z",
      isSubmitted: true,
    },
  ])

  return (
    <PageLayout title='Assignment Mentor Side'>
      <Head>
        <title>Assignment Mentor Side - KAT ITB 2023</title>
      </Head>

      <Box>
        <Flex gap={10} w={['50%', '40%', '30%', '20%', '15%']}>
          <Select
            placeholder='Pilih Kelompok'
            variant='filled'
            bg={'#1C939A'}
            color={'white'}
          >
            {group.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </Select>
        </Flex>

        <Flex flexDir={'column'} marginTop={10} gap='20'>
          {assignment.map((item) => (
            <Box>
              <Box marginBottom={5}>
                <Text as='b' fontSize={['3xl', '3xl', '4xl']}>
                  {' '}
                  {item.name}{' '}
                </Text>
              </Box>

              <Flex
                justifyContent='space-between'
                flexDir={['column', 'column', 'row']}
              >
                <TableContainer>
                  <Table variant='unstyled'>
                    <Tbody>
                      {students.map((student) => (
                        <Tr>
                          <Td>
                            {' '}
                            <Text as='b' fontSize='xl'>
                              {student.name}{' '}
                            </Text>
                          </Td>
                          <Td>
                            {' '}
                            <Text as='b' fontSize='xl'>
                              Kelompok {student.kelompok}
                            </Text>
                          </Td>
                          <Td>
                            {' '}
                            {student.isSubmitted ? (
                              <Button
                                variant='unstyled'
                                colorScheme='teal'
                                size='md'
                                width='100%'
                              >
                                Download
                                </Button>
                                ) : (
                                  <Text>
                                    tidak mengumpulkan tugas
                                  </Text>)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                <Box marginLeft={10}>
                  <Button
                    variant='outline'
                    colorScheme='teal'
                    size='md'
                    width='100%'
                  >
                    Download Semua
                  </Button>
                </Box>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
    </PageLayout>
  );
}
