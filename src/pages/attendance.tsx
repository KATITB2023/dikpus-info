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
  useToast
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
  const { data: session, status } = useSession();
  const toast = useToast();
  // const attendanceMutation = api.attendance.editAttendance.useMutation();
  // const attendanceQuery = api.attendance.getAttendance.useQuery({
  //   userId: session?.user.id ?? ''
  // });

  // let attendanceList: AttendanceEvent[] | undefined =
  //   attendanceQuery?.data?.event;
  // const eventsList = api.attendance.getEventList.useQuery().data;

  const attendanceList = [...attendanceEvents]; // dummy
  const [filteredList, setFilteredList] = useState<AttendanceEvent[]>([
    ...attendanceList
  ]);
  const [editStatus, setEditStatus] = useState<boolean[][]>(
    getEditingArr(attendanceList)
  );

  const [eventFilter, setEventFilter] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<number>(0);

  const eventsList = [{ title: 'Event A' }, { title: 'Event B' }];
  const groupList = [1, 2];

  const handleSelectEvent = (event: string) => {
    setEventFilter((prev) => {
      console.log(`setan ${event}`);
      filterAll(groupFilter, event);
      return event;
    });
  };

  const handleSelectGroup = (group: number) => {
    setGroupFilter((prev) => {
      console.log(`setan2 ${eventFilter}`);
      filterAll(group, eventFilter);
      return group;
    });
  };

  const filterAll = (group: number, event: string) => {
    let filtered;
    if (event !== '') {
      filtered = attendanceList?.filter(
        (attendance) => attendance.title === event
      );
      console.log(event);
      console.log(filtered);
      setEditStatus(getEditingArr(filtered));
    } else {
      filtered = [...attendanceList];
    }
    if (group !== 0) {
      filtered = filtered?.map((element) => {
        return {
          ...element,
          attendances: element.attendances.filter(
            (attendance) => attendance.student.group.group === group
          )
        };
      });
      console.log(filtered);

      setEditStatus(getEditingArr(filtered));
    } else {
      filtered = [...filtered];
    }
    setFilteredList([...filtered]);
    setEditStatus(getEditingArr(attendanceList));
  };

  const handleClickEdit = (index1: number, index2: number) => {
    let temp = [...editStatus];
    if (temp !== undefined && temp[index1]?.[index2] !== undefined) {
      (temp[index1] as boolean[])[index2] = true;
      setEditStatus(temp);
    }
  };

  const handleClickSave = async (index1: number, index2: number) => {
    let temp = [...editStatus];
    let alasan = '';
    let status = '';
    try {
      alasan = (
        document.getElementById(
          'alasan-' + index1 + '-' + index2
        ) as HTMLInputElement
      ).value;
      status = (
        document.getElementById(
          'status-' + index1 + '-' + index2
        ) as HTMLSelectElement
      ).value;
      console.log(`alasan: ${alasan} || status: ${status}`);
    } catch (e) {
      console.error(e);
    }

    if (temp !== undefined && temp[index1]?.[index2] !== undefined) {
      (temp[index1] as boolean[])[index2] = false;
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

        // const result = await attendanceMutation.mutateAsync({
        //   attendanceId: attendanceList[index1].attendances[index2].id,
        //   kehadiran: changedStatus
        // });
        const result = { message: 'Success' };

        toast({
          title: 'Kehadiran berhasil diubah',
          status: 'success',
          description: result?.message,
          duration: 750,
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
    if (temp !== undefined && temp[index1]?.[index2] !== undefined) {
      (temp[index1] as boolean[])[index2] = false;
      setEditStatus(temp);
    }
    toast({
      title: 'Change discarded',
      status: 'error',
      description: 'Change discarded',
      duration: 750,
      isClosable: true,
      position: 'top'
    });
  };

  return (
    <PageLayout title='Absen'>
      <VStack alignItems='flex-start' spacing={10}>
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
          {filteredList
            ? filteredList.map((event, index1) => {
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
                                          handleClickSave(index1, index2)
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
                                      borderRadius={0}
                                      variant='filled'
                                      bg='#1C939A'
                                      id={'status-' + index1 + '-' + index2}
                                      defaultValue={item.status}
                                    >
                                      <option>HADIR</option>
                                      <option>IZIN</option>
                                      <option>TIDAK_HADIR</option>
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
                                        id={'alasan-' + index1 + '-' + index2}
                                        defaultValue={'Dummy alasan'}
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
