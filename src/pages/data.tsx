import { AttendanceStatus } from '@prisma/client';

interface AttendanceEvent {
  attendances: {
    status: AttendanceStatus;
    student: {
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

let attendanceEvents: AttendanceEvent[] = [
  {
    attendances: [
      {
        status: AttendanceStatus.HADIR,
        student: {
          group: {
            group: 1
          }
        },
        studentId: '1a',
        id: 'eventA|student1a',
        eventId: 'eventA'
      },
      {
        status: AttendanceStatus.IZIN,
        student: {
          group: {
            group: 1
          }
        },
        studentId: '1b',
        id: 'eventA|student1b',
        eventId: 'eventA'
      },
      {
        status: AttendanceStatus.TIDAK_HADIR,
        student: {
          group: {
            group: 2
          }
        },
        studentId: '2a',
        id: 'eventA|student2a',
        eventId: 'eventA'
      }
    ],
    title: 'Event A',
    startTime: new Date(2021, 9, 1, 10, 0, 0),
    endTime: new Date(2021, 9, 1, 10, 0, 0)
  },
  {
    attendances: [
      {
        status: AttendanceStatus.IZIN,
        student: {
          group: {
            group: 1
          }
        },
        studentId: '1a',
        id: 'eventA|student1a',
        eventId: 'eventA'
      },
      {
        status: AttendanceStatus.TIDAK_HADIR,
        student: {
          group: {
            group: 1
          }
        },
        studentId: '1b',
        id: 'eventB|student1b',
        eventId: 'eventB'
      },
      {
        status: AttendanceStatus.TIDAK_HADIR,
        student: {
          group: {
            group: 2
          }
        },
        studentId: '2a',
        id: 'eventB|student2a',
        eventId: 'eventB'
      }
    ],
    title: 'Event B',
    startTime: new Date(2021, 9, 1, 10, 0, 0),
    endTime: new Date(2021, 9, 1, 10, 0, 0)
  }
];

function getEditingArr(attendanceList: AttendanceEvent[] | undefined) {
  if (attendanceList === undefined) return [];

  let editingArr: boolean[][] = [];
  attendanceList.forEach((event) => {
    let currEvent: boolean[] = [];
    event.attendances.forEach(() => {
      currEvent.push(false);
    });
    editingArr.push([...currEvent]);
  });

  return editingArr;
}

export { type AttendanceEvent, attendanceEvents, getEditingArr };
