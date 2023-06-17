/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useSession } from 'next-auth/react';
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
  useToast
} from '@chakra-ui/react';
import { BiDownload } from 'react-icons/bi';
import { type IconType } from 'react-icons/lib';
import { api } from '~/utils/api';
import { getDate, getTwoTime, validTime } from '~/utils/date';
import { FolderEnum } from '~/utils/file';
import { AttendanceStatus, type Event } from '@prisma/client';

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
  onClick?: any;
  isDisabled?: boolean;
}) => {
  const TableIcon = icon || (() => null);

  return (
    <Button
      bg={bg}
      borderRadius={0}
      _hover={isDisabled ? { bg: bg } : { opacity: 0.8 }}
      transition='all 0.2s ease-in-out'
      fontStyle='normal'
      onClick={isDisabled ? undefined : onClick}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
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

export const MenteeAttendance = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const downloadMutation = api.storage.generateURLForDownload.useMutation();
  const absenMutation = api.attendance.setAttendance.useMutation();
  const tableHeader = ['Tanggal', 'Waktu', 'Topik', 'Materi', 'Absen'];
  const eventList: Attendance[] | undefined = api.attendance.getEvents.useQuery(
    {
      userId: session?.user.id ?? ''
    }
  ).data;

  const downloadFile = async (filePath: string) => {
    // TODO ganti folder
    try {
      const { url } = await downloadMutation.mutateAsync({
        folder: FolderEnum.ASSIGNMENT,
        filename: filePath
      });

      window.open(url, '_blank');
    } catch (err: any) {
      toast({
        title: 'Error',
        status: 'error',
        description: err.message,
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const handleAbsen = async (eventId: string) => {
    try {
      const result = await absenMutation.mutateAsync({
        userId: session?.user.id ?? '',
        eventId
      });

      toast({
        title: 'Success',
        status: 'success',
        description: result?.message,
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        status: 'error',
        description: err.message,
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  return (
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
            eventList.map((item: Attendance, index: number) => {
              const tanggal = getDate(item.event.startTime);
              const waktu = getTwoTime(
                item.event.startTime,
                item.event.endTime
              );
              const alreadyAbsen =
                item.status === AttendanceStatus.HADIR ||
                item.status === AttendanceStatus.IZIN;
              const canAbsen = validTime(
                item.event.startTime,
                item.event.endTime
              );

              return (
                <Tr key={index}>
                  <Td>{tanggal}</Td>
                  <Td>{waktu}</Td>
                  <Td>{item.event.title}</Td>
                  <Td>
                    <TableButton
                      icon={BiDownload}
                      text='Download'
                      bg='#1C939A'
                      onClick={() => downloadFile(item.event.materialPath)}
                    />
                  </Td>
                  <Td>
                    {alreadyAbsen ? (
                      <TableButton
                        text={item.status.toLowerCase()}
                        bg='transparent'
                      />
                    ) : canAbsen ? (
                      <TableButton
                        text='Tandai Hadir'
                        bg='#1C939A'
                        onClick={() => handleAbsen(item.event.id)}
                      />
                    ) : (
                      <TableButton text={waktu} bg='#E8553E' isDisabled />
                    )}
                  </Td>
                </Tr>
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
