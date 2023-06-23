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
import { AttendanceStatus, type Event } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { saveAs } from "file-saver";
import Link from "next/link";
import { match } from "ts-pattern";
import { api } from "~/utils/api";
import { getDate, getDateList, validTime, afterTime } from "~/utils/date";
import { FolderEnum, downloadFile } from "~/utils/file";

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

const TableRow = ({ attendance }: { attendance: Attendance }) => {
  const [loading, setLoading] = useState(false);
  const [alreadyAbsen, setAlreadyAbsen] = useState(
    attendance.status === AttendanceStatus.HADIR ||
      attendance.status === AttendanceStatus.IZIN
  );
  const toast = useToast();
  const downloadMutation = api.storage.generateURLForDownload.useMutation();
  const absenMutation = api.attendance.setAttendance.useMutation();
  const tanggal = getDate(attendance.event.startTime);
  const canAbsen = validTime(
    attendance.event.startTime,
    attendance.event.endTime
  );
  const absenDahLewat = afterTime(attendance.event.endTime);

  const handleDownloadFile = async () => {
    if (!attendance.event.materialPath) return null;

    try {
      const filePath = attendance.event.materialPath;
      const { url } = await downloadMutation.mutateAsync({
        folder: FolderEnum.MATERIAL,
        filename: filePath
      });

      const content = await downloadFile(url);
      saveAs(content, filePath);
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
        eventId
      });

      toast({
        title: "Success",
        status: "success",
        description: result.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });

      setAlreadyAbsen(true);
      attendance.status = AttendanceStatus.HADIR;
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

  const displayStatus = (status: AttendanceStatus) => {
    return match(status)
      .with(AttendanceStatus.HADIR, () => "Hadir")
      .with(AttendanceStatus.IZIN, () => "Izin")
      .with(AttendanceStatus.TIDAK_HADIR, () => "Tidak Hadir")
      .exhaustive();
  };

  return (
    <Tr>
      <Td>{tanggal}</Td>
      <Td>{attendance.event.title}</Td>
      <Td>
        {attendance.event.materialPath !== null ? (
          <TableButton
            icon={BiDownload}
            text='Download'
            bg='#1C939A'
            onClick={() => void handleDownloadFile()}
          />
        ) : (
          <>-</>
        )}
      </Td>
      <Td>
        {attendance.event.youtubeLink !== null ? (
          <Link href={attendance.event.youtubeLink} target='_blank'>
            <TableButton text='Youtube' bg='#1C939A' />
          </Link>
        ) : (
          <>-</>
        )}
      </Td>
      <Td>
        {alreadyAbsen ? (
          <TableButton
            text={displayStatus(attendance.status)}
            bg='transparent'
          />
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
        ) : absenDahLewat ? (
          <TableButton
            text={displayStatus(attendance.status)}
            bg='transparent'
          />
        ) : (
          <TableButton text='Belum Dibuka' bg='#E8553E' isDisabled />
        )}
      </Td>
    </Tr>
  );
};

export const MenteeAttendance = () => {
  const { data: session } = useSession();
  const eventQuery = api.attendance.getEvents.useQuery(undefined, {
    enabled: session?.user !== undefined
  });

  const [eventList, setEventList] = useState<Attendance[] | undefined>(
    eventQuery.data
  );
  const [filter, setFilter] = useState<string>("");

  const dateList = getDateList(eventQuery.data);
  const tableHeader = ["Tanggal", "Topik", "Materi", "Video", "Absen"];

  useEffect(() => {
    let toFilter = eventQuery.data;

    if (filter !== "") {
      toFilter = toFilter?.filter((event) => {
        const eventDate = getDate(event.event.startTime);
        return eventDate === filter;
      });
    }

    setEventList(
      toFilter?.sort((a: Attendance, b: Attendance) => {
        return a.event.startTime > b.event.startTime
          ? 1
          : a.event.startTime < b.event.startTime
          ? -1
          : 0;
      })
    );
  }, [eventQuery?.data, filter]);

  return (
    <Flex flexDir='column' gap={10}>
      <Select
        placeholder='Pilih tanggal'
        variant='filled'
        bg='#1C939A'
        onChange={(e) => setFilter(e.target.value)}
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
        {dateList.map((date, index) => (
          <option key={index}>{date}</option>
        ))}
      </Select>
      <TableContainer>
        <Table variant='unstyled'>
          <Thead borderBottom='1px solid'>
            <Tr>
              {tableHeader.map((header, index) => (
                <Th fontFamily='SomarRounded-Bold' key={index}>
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {eventList && eventList?.length > 0 ? (
              eventList.map((item: Attendance, index: number) => (
                <TableRow attendance={item} key={index} />
              ))
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
