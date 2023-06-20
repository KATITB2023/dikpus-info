import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Flex,
  Text,
  useToast,
  Spinner,
  Select
} from "@chakra-ui/react";
import { BiDownload } from "react-icons/bi";
import { type IconType } from "react-icons/lib";
import { api } from "~/utils/api";
import { getDate, getDateList, validTime } from "~/utils/date";
import { FolderEnum } from "~/utils/file";
import { AttendanceStatus, type Event } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";

export interface Attendance {
  status: AttendanceStatus;
  event: Event;
}

const TableButton = ({
  icon,
  text,
  bg,
  onClick,
  isDisabled = false
}: {
  icon?: IconType;
  text: string;
  bg: string;
  onClick?: () => void;
  isDisabled?: boolean;
}) => {
  const TableIcon = icon || (() => null);

  return (
    <Button
      bg={bg}
      _hover={isDisabled || !onClick ? { bg: bg } : { opacity: 0.8 }}
      transition='all 0.2s ease-in-out'
      fontStyle='normal'
      onClick={isDisabled ? undefined : onClick}
      cursor={isDisabled ? "not-allowed" : !onClick ? "default" : "pointer"}
    >
      <Flex
        flexDir='row'
        alignItems='center'
        justifyContent='center'
        color='white'
        gap={2}
      >
        <TableIcon size={24} />
        <Text
          alignSelf='center'
          pt={1}
          fontWeight='normal'
          textTransform='capitalize'
        >
          {text}
        </Text>
      </Flex>
    </Button>
  );
};

const TableRow = ({
  attendance,
  userId
}: {
  attendance: Attendance;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [alreadyAbsen, setAlreadyAbsen] = useState(
    attendance.status === AttendanceStatus.HADIR ||
      attendance.status === AttendanceStatus.IZIN
  );
  const [stats, setStats] = useState(attendance.status.toLowerCase());
  const toast = useToast();
  const downloadMutation = api.storage.generateURLForDownload.useMutation();
  const absenMutation = api.attendance.setAttendance.useMutation();
  const tanggal = getDate(attendance.event.startTime);
  // const waktu = getTwoTime(
  //   attendance.event.startTime,
  //   attendance.event.endTime
  // );
  const canAbsen = validTime(
    attendance.event.startTime,
    attendance.event.endTime
  );

  const downloadFile = async (filePath: string) => {
    try {
      const { url } = await downloadMutation.mutateAsync({
        folder: FolderEnum.MATERIAL,
        filename: filePath
      });

      const file = await fetch(url);
      const blob = await file.blob();
      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.download =
        "Materi " +
        attendance.event.title +
        filePath.slice(filePath.lastIndexOf("."));
      link.click();

      URL.revokeObjectURL(link.href);
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
  };

  const handleAbsen = async (eventId: string) => {
    setLoading(true);
    try {
      const result = await absenMutation.mutateAsync({
        userId,
        eventId
      });

      toast({
        title: "Success",
        status: "success",
        description: result?.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });

      setAlreadyAbsen(true);
      setStats("Hadir");
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
    setLoading(false);
  };

  return (
    <Tr>
      <Td>{tanggal}</Td>
      {/* <Td>{waktu}</Td> */}
      <Td>{attendance.event.title}</Td>
      <Td>
        {attendance.event.materialPath !== "" ? (
          <TableButton
            icon={BiDownload}
            text='Download'
            bg='#1C939A'
            onClick={() => void downloadFile(attendance.event.materialPath)}
          />
        ) : (
          <>-</>
        )}
      </Td>
      <Td>
        {attendance.event.youtubeLink !== null ? (
          <Link href={attendance.event.youtubeLink ?? "/"} target='_blank'>
            <TableButton text='Youtube' bg='#1C939A' onClick={() => void {}} />
          </Link>
        ) : (
          <>-</>
        )}
      </Td>
      <Td>
        {alreadyAbsen ? (
          <TableButton text={stats} bg='transparent' />
        ) : canAbsen ? (
          loading ? (
            <Spinner color='#1C939A' />
          ) : (
            <TableButton
              text='Tandai Hadir'
              bg='#1C939A'
              onClick={() => void handleAbsen(attendance.event.id)}
            />
          )
        ) : (
          <TableButton text='Belum Dibuka' bg='#E8553E' isDisabled />
        )}
      </Td>
    </Tr>
  );
};

export const MenteeAttendance = () => {
  const { data: session } = useSession();
  const eventQuery = api.attendance.getEvents.useQuery({
    userId: session?.user.id ?? ""
  });

  const [eventList, setEventList] = useState<Attendance[] | undefined>(
    eventQuery?.data
  );

  const dateList = getDateList(eventQuery?.data);
  const tableHeader = ["Tanggal", "Topik", "Materi", "Video", "Absen"];

  const handleSelect = (date: string) => {
    if (date === "") {
      setEventList(eventQuery?.data);
      return;
    }

    const filteredEvent = eventQuery?.data?.filter((event) => {
      const eventDate = getDate(event.event.startTime);
      return eventDate === date;
    });

    setEventList(filteredEvent);
  };

  useEffect(() => {
    setEventList(
      eventQuery?.data?.sort((a: Attendance, b: Attendance) => {
        const dateA = getDate(a.event.startTime);
        const dateB = getDate(b.event.startTime);

        // whygini?LINTERCUK
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return a.event.startTime > b.event.startTime ? 1 : -1;
      })
    );
  }, [eventQuery?.data]);

  return (
    <Flex flexDir='column' gap={10}>
      <Select
        placeholder='Pilih tanggal'
        variant='filled'
        bg='#1C939A'
        onChange={(e) => handleSelect(e.target.value)}
        transition='all 0.2s ease-in-out'
        _hover={{
          opacity: 0.8
        }}
        css={{
          option: {
            background: "#1C939A"
          }
        }}
        w='fit-content'
      >
        {dateList
          ? dateList.map((date, index) => <option key={index}>{date}</option>)
          : null}
      </Select>
      <TableContainer>
        <Table variant='unstyled'>
          <Thead borderBottom='1px solid'>
            <Tr>
              {tableHeader.map((header, index) => {
                return (
                  <Th fontFamily='SomarRounded-Bold' key={index}>
                    {header}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {eventList && eventList?.length > 0 ? (
              eventList.map((item: Attendance, index: number) => {
                return (
                  <TableRow
                    attendance={item}
                    userId={session?.user.id ?? ""}
                    key={index}
                  />
                );
              })
            ) : (
              <Tr>
                <Td colSpan={6} textAlign='center'>
                  Eventnya belum ada nih, coba cek lagi nanti ya!
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
