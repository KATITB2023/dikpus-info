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
import { useState } from 'react';
import { api } from '~/utils/api';

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

  return (
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
                              <Button
                                variant='unstyled'
                                colorScheme='teal'
                                size='md'
                                width='100%'
                                textAlign='initial'
                              >
                                <svg
                                  width='36'
                                  height='36'
                                  viewBox='0 0 48 48'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path
                                    d='M36 30V36H12V30H8V36C8 38.2 9.8 40 12 40H36C38.2 40 40 38.2 40 36V30H36ZM34 22L31.18 19.18L26 24.34V8H22V24.34L16.82 19.18L14 22L24 32L34 22Z'
                                    fill='white'
                                  />
                                </svg>
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
                  <Button
                    variant='outline'
                    bg={'#1C939A'}
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
  );
}
