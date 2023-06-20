import { useSession } from "next-auth/react";
import { useState } from "react";
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
  Spinner
} from "@chakra-ui/react";
import { BiDownload } from "react-icons/bi";
import { type IconType } from "react-icons/lib";
import { api } from "~/utils/api";
import { getDate, getTwoTime, validTime } from "~/utils/date";
import { FolderEnum } from "~/utils/file";
import { AttendanceStatus, type Event } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";

interface Attendance {
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
  const waktu = getTwoTime(
    attendance.event.startTime,
    attendance.event.endTime
  );
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
      <Td>{waktu}</Td>
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
          <Link href={attendance.event.youtubeLink} target='_blank'>
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
          <TableButton text={waktu} bg='#E8553E' isDisabled />
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

  const eventList = eventQuery?.data;
  const tableHeader = ["Tanggal", "Waktu", "Topik", "Materi", "Video", "Absen"];

  return (
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
              <Td colSpan={5} textAlign='center'>
                Eventnya belum ada nih, coba cek lagi nanti ya!
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
