import {
  Button,
  VStack,
  HStack,
  Select,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Heading,
  FormControl,
  Input
} from '@chakra-ui/react';
import { HiPencil, HiOutlineX, HiOutlineCheck } from 'react-icons/hi';
import PageLayout from '../layout';

export const Attendance = () => {
  // usestate bla bla

  let days = [
    '1 Januari 2023',
    '2 Januari 2023',
    '3 Januari 2023',
    '4 Januari 2023'
  ];

  let groups = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N'
  ];

  let isi = [
    {
      nama: 'nama 1',
      kelompok: 'A',
      status: 'Hadir',
      alasan: ''
    },
    {
      nama: 'nama 2',
      kelompok: 'B',
      status: 'Izin',
      alasan: 'Sakit'
    },
    {
      nama: 'nama 3',
      kelompok: 'C',
      status: 'Tidak Hadir',
      alasan: ''
    },
    {
      nama: 'nama 4',
      kelompok: 'D',
      status: 'Hadir',
      alasan: ''
    }
  ];

  return (
    <PageLayout title='Absen'>
      <VStack alignItems='flex-start' spacing={10}>
        <HStack spacing={10}>
          <Select
            placeholder='Pilih tanggal'
            borderRadius={0}
            variant='filled'
            bg='#1C939A'
          >
            {days.map((day) => {
              return <option>{day}</option>;
            })}
          </Select>
          <Select
            placeholder='Pilih kelompok'
            borderRadius={0}
            variant='filled'
            bg='#1C939A'
          >
            {groups.map((group) => {
              return <option>{group}</option>;
            })}
          </Select>
        </HStack>
        <VStack spacing={8}>
          {days.map((day) => {
            return (
              <VStack alignItems='flex-start' spacing={5}>
                <Heading size='lg'>{day}</Heading>
                <TableContainer>
                  <Table variant='unstyled'>
                    <Tbody>
                      {isi.map((item) => {
                        return (
                          <Tr>
                            <Td>
                              <Button
                                variant='ghost'
                                borderRadius={0}
                                _hover={{
                                  background: '#25263E'
                                }}
                              >
                                <HiPencil color='white' />
                              </Button>
                            </Td>
                            <Td>{item.nama}</Td>
                            <Td>Kelompok {item.kelompok}</Td>
                            <Td>{item.status}</Td>
                            <Td>{item.alasan}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
            );
          })}
        </VStack>
        <VStack spacing={8}>
          {days.map((day) => {
            return (
              <VStack alignItems='flex-start' spacing={5}>
                <Heading size='lg'>{day}</Heading>
                <TableContainer>
                  <Table variant='unstyled'>
                    <Tbody>
                      {isi.map((item) => {
                        return (
                          <Tr>
                            <Td>
                              <HStack spacing={0}>
                                <Button
                                  variant='ghost'
                                  borderRadius={0}
                                  _hover={{
                                    background: '#25263E'
                                  }}
                                >
                                  <HiOutlineCheck color='white' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  borderRadius={0}
                                  _hover={{
                                    background: '#761300'
                                  }}
                                >
                                  <HiOutlineX color='white' />
                                </Button>
                              </HStack>
                            </Td>
                            <Td>{item.nama}</Td>
                            <Td>Kelompok {item.kelompok}</Td>
                            <Td>
                              <Select
                                placeholder='Pilih status'
                                borderRadius={0}
                                variant='filled'
                                bg='#1C939A'
                              >
                                <option>Hadir</option>
                                <option>Izin</option>
                                <option>Tidak Hadir</option>
                              </Select>
                            </Td>
                            <Td>
                              <FormControl isRequired>
                                <Input
                                  placeholder='Masukkan alasan...'
                                  variant='flushed'
                                />
                              </FormControl>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
            );
          })}
        </VStack>
      </VStack>
    </PageLayout>
  );
};
