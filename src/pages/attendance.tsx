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
  Input,
  useToast,
  Text
} from '@chakra-ui/react';
import { HiPencil, HiOutlineX, HiOutlineCheck } from 'react-icons/hi';
import PageLayout from '../layout';
import { useState } from 'react';
import { api } from '~/utils/api';
import { AttendanceStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { useSession } from 'next-auth/react';
import { type AttendanceEvent, attendanceEvents, getEditingArr } from './data';

export const Attendance = () => {
  /* TODO
      Value getter for input, and select */

  const { data: session, status } = useSession();
  const toast = useToast();
  // const absenMutation = api.attendance.editAttendance.useMutation();
  // const attendanceQuery = api.attendance.getAttendance.useQuery({
  //   userId: session?.user.id ?? ''
  // });

  // let attendanceList: AttendanceEvent[] | undefined =
  //   attendanceQuery?.data?.event;
  // const eventsList = api.attendance.getEventList.useQuery().data;
  const [attendanceList, setAttendanceList] =
    useState<AttendanceEvent[]>(attendanceEvents);
  const [editStatus, setEditStatus] = useState<boolean[][]>(
    getEditingArr(attendanceList)
  );
  const [eventFilter, setEventFilter] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<number>(-1);

  const eventsList = [{ title: 'Event A' }, { title: 'Event B' }];
  const groupList = [1, 2];

  const handleSelectEvent = (event: string) => {
    console.log(`event: ${event}`);
    setEventFilter(event);
    console.log(`event filter: ${eventFilter}`);
    filterAll();
  };

  const handleSelectGroup = (group: number) => {
    setGroupFilter(group);
    filterAll();
  };

  const filterAll = () => {
    setAttendanceList([...attendanceEvents]);
    if (eventFilter !== '') {
      filterByEvent(eventFilter);
    }
    if (groupFilter !== -1) {
      filterByGroup(groupFilter);
    }
    setEditStatus(getEditingArr(attendanceList));
  };

  const filterByEvent = (event: string) => {
    let filtered = attendanceList?.filter(
      (attendance) => attendance.title === event
    );
    setAttendanceList([...filtered]);
    setEditStatus(getEditingArr(filtered));
  };

  const filterByGroup = (group: number) => {
    setAttendanceList([...attendanceEvents]);
    let filtered = attendanceList?.map((element) => {
      return {
        ...element,
        attendances: element.attendances.filter(
          (attendance) => attendance.student.group.group === group
        )
      };
    });
    setAttendanceList([...filtered]);
    setEditStatus(getEditingArr(filtered));
  };

  const handleClickEdit = (index1: number, index2: number) => {
    let temp = [...editStatus];
    if (temp !== undefined && temp[index1][index2] !== undefined) {
      temp[index1][index2] = true;
      setEditStatus(temp);
    }
  };

  const handleClickSave = async (
    index1: number,
    index2: number,
    status: string,
    alasan?: string
  ) => {
    let temp = [...editStatus];
    if (temp !== undefined && temp[index1][index2] !== undefined) {
      temp[index1][index2] = false;
      setEditStatus(temp);

      let changedStatus;
      switch (status) {
        case 'Hadir':
          changedStatus = AttendanceStatus.HADIR;
          break;
        case 'Izin':
          changedStatus = AttendanceStatus.IZIN;
          break;
        default:
          changedStatus = AttendanceStatus.TIDAK_HADIR;
      }

      try {
        if (attendanceList === undefined) return;

        // const result = await absenMutation.mutateAsync({
        //   attendanceId: attendanceList[index1].attendances[index2].id,
        //   kehadiran: changedStatus
        // });
        const result = { message: 'Success' };

        toast({
          title: 'Success',
          status: 'success',
          description: result?.message,
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
      } catch (err: unknown) {
        if (!(err instanceof TRPCError)) throw err;

        toast({
          title: 'Error',
          status: 'error',
          description: err.message,
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
      }
    }
  };

  const handleClickDiscard = (index1: number, index2: number) => {
    let temp = [...editStatus];
    if (temp !== undefined && temp[index1][index2] !== undefined) {
      temp[index1][index2] = false;
      setEditStatus(temp);
    }
    console.log(`change discarded`);
  };

  return (
    <PageLayout title='Absen'>
      <VStack alignItems='flex-start' spacing={10}>
        <Text>Event filter: {eventFilter}</Text>
        <Text>Group filter: {groupFilter}</Text>
        <HStack spacing={10}>
          <Select
            placeholder='Pilih tanggal'
            borderRadius={0}
            variant='filled'
            bg='#1C939A'
            onChange={(e) => handleSelectEvent(e.target.value)}
          >
            {eventsList
              ? eventsList.map((event) => {
                  return <option>{event.title}</option>;
                })
              : null}
          </Select>
          <Select
            placeholder='Pilih kelompok'
            borderRadius={0}
            variant='filled'
            bg='#1C939A'
            onChange={(e) => handleSelectGroup(Number(e.target.value))}
          >
            {groupList
              ? groupList.map((group) => {
                  return <option>{group}</option>;
                })
              : null}
          </Select>
        </HStack>
        <VStack spacing={8} alignItems='flex-start'>
          {attendanceList
            ? attendanceList.map((event, index1) => {
                return (
                  <VStack alignItems='flex-start' spacing={5}>
                    <Heading size='lg'>{event.title}</Heading>
                    <TableContainer>
                      <Table variant='unstyled'>
                        <Tbody>
                          {event.attendances.map((item, index2) => {
                            return (
                              <Tr>
                                <Td key={index2}>
                                  {editStatus?.[index1]?.[index2] ? (
                                    <>
                                      <Button
                                        variant='ghost'
                                        borderRadius={0}
                                        _hover={{
                                          background: '#25263E'
                                        }}
                                        onClick={() =>
                                          handleClickSave(
                                            index1,
                                            index2,
                                            'Tidak Hadir'
                                          )
                                        }
                                      >
                                        <HiOutlineCheck color='white' />
                                      </Button>
                                      <Button
                                        variant='ghost'
                                        borderRadius={0}
                                        _hover={{
                                          background: '#761300'
                                        }}
                                        onClick={() =>
                                          handleClickDiscard(index1, index2)
                                        }
                                      >
                                        <HiOutlineX color='white' />
                                      </Button>{' '}
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        variant='ghost'
                                        borderRadius={0}
                                        _hover={{
                                          background: '#25263E'
                                        }}
                                        onClick={() =>
                                          handleClickEdit(index1, index2)
                                        }
                                      >
                                        <HiPencil color='white' />
                                      </Button>
                                    </>
                                  )}
                                </Td>
                                <Td>{item.studentId}</Td>
                                <Td>Kelompok {item.student.group.group}</Td>
                                <Td>
                                  {editStatus?.[index1]?.[index2] ? (
                                    <Select
                                      placeholder='Pilih status'
                                      borderRadius={0}
                                      variant='filled'
                                      bg='#1C939A'
                                      value={item.status}
                                      id='status-select'
                                    >
                                      <option>Hadir</option>
                                      <option>Izin</option>
                                      <option>Tidak Hadir</option>
                                    </Select>
                                  ) : (
                                    item.status
                                  )}
                                </Td>
                                <Td>
                                  {editStatus?.[index1]?.[index2] ? (
                                    <FormControl isRequired>
                                      <Input
                                        placeholder='Masukkan alasan...'
                                        variant='flushed'
                                      />
                                    </FormControl>
                                  ) : (
                                    'Dummy alasan'
                                  )}
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                );
              })
            : null}
        </VStack>
      </VStack>
    </PageLayout>
  );
};
