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
import { api, type RouterOutputs } from "~/utils/api";
import { AttendanceStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";

const getEditingArr = (
  attendanceList: RouterOutputs["attendance"]["getAttendance"]["event"]
) => {
  return attendanceList.map((event) => {
    return event.attendances.map(() => {
      return false;
    });
  });
};

export const MentorAttendance = () => {
  const { data: session } = useSession();

  const toast = useToast();
  const attendanceMutation = api.attendance.editAttendance.useMutation();
  const attendanceQuery = api.attendance.getAttendance.useQuery({
    userId: session?.user.id ?? ""
  });
  const eventListQuery = api.attendance.getEventList.useQuery();

  const attendanceData = attendanceQuery.data;
  const eventList = eventListQuery.data;

  const [attendanceList, setAttendanceList] = useState<
    RouterOutputs["attendance"]["getAttendance"]["event"]
  >([]);
  const [filteredList, setFilteredList] =
    useState<RouterOutputs["attendance"]["getAttendance"]["event"]>(
      attendanceList
    );
  const [editStatus, setEditStatus] = useState<boolean[][]>(
    getEditingArr(attendanceList)
  );
  const [eventFilter, setEventFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<number>(0);
  const [groupList, setGroupList] = useState<number[]>([]);

  useEffect(() => {
    setAttendanceList(attendanceData?.event ?? []);
  }, [attendanceData]);

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
    let filtered: RouterOutputs["attendance"]["getAttendance"]["event"];

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

      let changedStatus: AttendanceStatus;
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
            (
              filteredList[
                index1
              ] as RouterOutputs["attendance"]["getAttendance"]["event"][number]
            ).attendances[
              index2
            ] as RouterOutputs["attendance"]["getAttendance"]["event"][number]["attendances"][number]
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
          (
            temp[
              index1
            ] as RouterOutputs["attendance"]["getAttendance"]["event"][number]
          ).attendances[
            index2
          ] as RouterOutputs["attendance"]["getAttendance"]["event"][number]["attendances"][number]
        ).status = changedStatus;

        (
          (
            temp[
              index1
            ] as RouterOutputs["attendance"]["getAttendance"]["event"][number]
          ).attendances[
            index2
          ] as RouterOutputs["attendance"]["getAttendance"]["event"][number]["attendances"][number]
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
          {eventList
            ? eventList.map((event, index: number) => {
                return <option key={index}>{event.title}</option>;
              })
            : null}
        </Select>
        <Select
          placeholder='Pilih kelompok'
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
