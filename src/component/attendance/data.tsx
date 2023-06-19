import { type AttendanceStatus } from '@prisma/client';

interface AttendanceEvent {
  attendances: {
    status: AttendanceStatus;
    // reason?: string; // ini gaada...
    student: {
      firstName: string;
      lastName: string;
      group: {
        group: number;
      };
    };
    studentId: string;
    id: string;
    eventId: string;
  }[];
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

export { type AttendanceEvent, getEditingArr };
