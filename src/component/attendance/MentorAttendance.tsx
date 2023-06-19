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
} from "@chakra-ui/react";
import { HiPencil, HiOutlineX, HiOutlineCheck } from "react-icons/hi";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { AttendanceStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";

interface AttendanceReason {
  reason?: string | null;
}

interface AttendanceData {
  status: AttendanceStatus;
  student: {
    firstName: string;
    lastName: string | null;
    group: {
      group: number;
    };
  };
  studentId: string;
  id: string;
  eventId: string;
  reason?: AttendanceReason | null;
}

interface AttendanceEvent {
  attendances: AttendanceData[];
  title: string;
  startTime: Date;
  endTime: Date;
}

function getEditingArr(attendanceList: AttendanceEvent[] | undefined) {
  if (attendanceList === undefined) return [];

  const editingArr: boolean[][] = [];
  attendanceList.forEach((event) => {
    const currEvent: boolean[] = [];
    event.attendances.forEach(() => {
      currEvent.push(false);
    });
    editingArr.push([...currEvent]);
  });

  return editingArr;
}

export const MentorAttendance = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const attendanceMutation = api.attendance.editAttendance.useMutation();
  const attendanceQuery = api.attendance.getAttendance.useQuery({
    userId: session?.user.id ?? ""
  });
  const eventsList = api.attendance.getEventList.useQuery().data;

  const [attendanceList, setAttendanceList] = useState<AttendanceEvent[]>([]);
  const [filteredList, setFilteredList] =
    useState<AttendanceEvent[]>(attendanceList);
  const [editStatus, setEditStatus] = useState<boolean[][]>(
    getEditingArr(attendanceList)
  );
  const [eventFilter, setEventFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<number>(0);
  const [groupList, setGroupList] = useState<number[]>([]);

  useEffect(() => {
    attendanceQuery?.data?.event
      ? setAttendanceList(attendanceQuery?.data?.event)
      : setAttendanceList([]);
  }, [attendanceQuery]);

  useEffect(() => {
    setFilteredList([...attendanceList]);

    const temp: number[] = [];
    attendanceList.forEach((event) => {
      event.attendances.forEach((attendance) => {
        if (!temp.includes(attendance.student.group.group)) {
          temp.push(attendance.student.group.group);
        }
      });
    });
    setGroupList([...temp]);
  }, [attendanceList]);

  useEffect(() => {
    setEditStatus(getEditingArr(filteredList));
  }, [filteredList]);

  const handleSelectEvent = (event: string) => {
    setEventFilter(() => {
      filterAll(groupFilter, event);
      return event;
    });
  };

  const handleSelectGroup = (group: number) => {
    setGroupFilter(() => {
      filterAll(group, eventFilter);
      return group;
    });
  };

  const filterAll = (group: number, event: string) => {
    let filtered: AttendanceEvent[];

    if (event !== "") {
      filtered = attendanceList?.filter(
        (attendance) => attendance.title === event
      );
    } else {
      filtered = attendanceList;
    }

    if (group !== 0) {
      filtered = filtered.map((element) => {
        return {
          ...element,
          attendances: element.attendances.filter(
            (attendance) => attendance.student.group.group === group
          )
        };
      });
    }

    setFilteredList([...filtered]);
  };

  const handleClickEdit = (index1: number, index2: number) => {
    const temp = [...editStatus];
    if (temp !== undefined && temp[index1]?.[index2] !== undefined) {
      (temp[index1] as boolean[])[index2] = true;
      setEditStatus(temp);
    }
  };

  const handleClickSave = async (index1: number, index2: number) => {
    const temp = [...editStatus];
    let alasan = "";
    let status = "";

    try {
      alasan = (
        document.getElementById(
          `alasan-${index1}-${index2}`
        ) as HTMLInputElement
      ).value;
      status = (
        document.getElementById(
          `status-${index1}-${index2}`
        ) as HTMLSelectElement
      ).value;
    } catch (e) {}

    if (temp !== undefined && temp[index1]?.[index2] !== undefined) {
      (temp[index1] as boolean[])[index2] = false;
      setEditStatus(temp);

      let changedStatus;
      switch (status) {
        case "HADIR":
          changedStatus = AttendanceStatus.HADIR;
          break;
        case "IZIN":
          changedStatus = AttendanceStatus.IZIN;
          break;
        default:
          changedStatus = AttendanceStatus.TIDAK_HADIR;
      }

      try {
        const result = await attendanceMutation.mutateAsync({
          attendanceId: (
            (filteredList[index1] as AttendanceEvent).attendances[
              index2
            ] as AttendanceData
          ).id,
          kehadiran: changedStatus,
          reason: alasan
        });

        toast({
          title: "Success",
          status: "success",
          description: result?.message,
          duration: 2000,
          isClosable: true,
          position: "top"
        });

        const temp = [...filteredList];
        (
          (temp[index1] as AttendanceEvent).attendances[
            index2
          ] as AttendanceData
        ).status = changedStatus;

        (
          (temp[index1] as AttendanceEvent).attendances[
            index2
          ] as AttendanceData
        ).reason = { reason: alasan };
        setFilteredList(temp);
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
    }
  };

  const handleClickDiscard = (index1: number, index2: number) => {
    const temp = [...editStatus];
    if (temp !== undefined && temp[index1]?.[index2] !== undefined) {
      (temp[index1] as boolean[])[index2] = false;
      setEditStatus(temp);
    }
    toast({
      title: "Canceled",
      status: "error",
      description: "Change discarded",
      duration: 2000,
      isClosable: true,
      position: "top"
    });
  };

  return (
    <VStack alignItems='flex-start' spacing={10}>
      <HStack spacing={10}>
        <Select
          placeholder='Pilih event'
          borderRadius={0}
          variant='filled'
          bg='#1C939A'
          onChange={(e) => handleSelectEvent(e.target.value)}
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
          {eventsList
            ? eventsList.map((event, index: number) => {
                return <option key={index}>{event.title}</option>;
              })
            : null}
        </Select>
        <Select
          placeholder='Pilih kelompok'
          borderRadius={0}
          variant='filled'
          bg='#1C939A'
          onChange={(e) => handleSelectGroup(Number(e.target.value))}
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
          {groupList
            ? groupList.map((group, index: number) => {
                return <option key={index}>{group}</option>;
              })
            : null}
        </Select>
      </HStack>
      <VStack spacing={8} alignItems='flex-start'>
        {filteredList
          ? filteredList.map((event, index1) => {
              return (
                <VStack
                  alignItems='flex-start'
                  spacing={5}
                  key={`${index1}-${event.title}`}
                >
                  <Heading size='lg'>{event.title}</Heading>
                  <TableContainer>
                    <Table variant='unstyled'>
                      <Tbody>
                        {event.attendances.map((item, index2) => {
                          return (
                            <Tr key={index2}>
                              <Td>
                                {editStatus?.[index1]?.[index2] ? (
                                  <>
                                    <Button
                                      variant='ghost'
                                      borderRadius={0}
                                      _hover={{
                                        background: "#25263E"
                                      }}
                                      onClick={() =>
                                        void handleClickSave(index1, index2)
                                      }
                                    >
                                      <HiOutlineCheck color='white' />
                                    </Button>
                                    <Button
                                      variant='ghost'
                                      borderRadius={0}
                                      _hover={{
                                        background: "#761300"
                                      }}
                                      onClick={() =>
                                        handleClickDiscard(index1, index2)
                                      }
                                    >
                                      <HiOutlineX color='white' />
                                    </Button>{" "}
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant='ghost'
                                      borderRadius={0}
                                      _hover={{
                                        background: "#25263E"
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
                              <Td>{`${item.student.firstName} ${
                                item.student.lastName ?? ""
                              }`}</Td>
                              <Td>Kelompok {item.student.group.group}</Td>
                              <Td>
                                {editStatus?.[index1]?.[index2] ? (
                                  <Select
                                    borderRadius={0}
                                    variant='filled'
                                    bg='#1C939A'
                                    id={`status-${index1}-${index2}`}
                                    defaultValue={item.status}
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
                                  <FormControl>
                                    <Input
                                      placeholder='Masukkan alasan...'
                                      variant='flushed'
                                      id={`alasan-${index1}-${index2}`}
                                      defaultValue={item.reason?.reason ?? ""}
                                    />
                                  </FormControl>
                                ) : (
                                  item.reason?.reason
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
  );
};
