import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const group1 = await prisma.group.create({
    data: {
      group: 1,
      zoomLink: 'ini link zoom'
    }
  })
  console.log(group1)

  const group2 = await prisma.group.create({
    data: {
      group: 2,
      zoomLink: 'ini link zoom'
    }
  })
  console.log(group2)

  const user1 = await prisma.user.create({
    data: {
      nim: '13520104',
      passwordHash: await hash('13520104', 10),
      role: 'MENTOR',
      mentor: {
        create: {}
      }
    }
  });

  console.log(user1);

  const mentor2 = await prisma.user.create({
    data: {
      nim: '13520999',
      passwordHash: await hash('13520999', 10),
      role: 'MENTOR',
      mentor: {
        create: {}
      }
    }
  });
  console.log(mentor2)

  const mentor1Id = await prisma.mentor.findFirst({
    where: {
      userId: user1.id
    },
    select: {
      id: true
    }
  });

  const mentor2Id = await prisma.mentor.findFirst({
    where: {
      userId: mentor2.id
    },
    select: {
      id: true
    }
  })

  if (!mentor1Id || !mentor2Id) {
    return;
  }

  const mentorGroup1 = await prisma.mentorGroup.create({
    data: {
      mentorId: mentor1Id.id,
      groupId: group1.id,
    }
  })
  console.log(mentorGroup1);

  const mentorGroup2 = await prisma.mentorGroup.create({
    data: {
      mentorId: mentor2Id.id,
      groupId: group2.id,
    }
  })
  console.log(mentorGroup2);

  const mentorId2 = await prisma.mentor.findFirst({
    where: {
      userId: mentor2.id
    },
    select: {
      id: true
    }
  });

  if (!mentorId2) {
    return;
  }

  const user2 = await prisma.user.create({
    data: {
      nim: '13520080',
      passwordHash: await hash('13520080', 10),
      role: 'STUDENT',
      student: {
        create: {
          gender: 'MALE',
          firstName: 'Jason',
          lastName: 'Kanggara',
          fakultas: 'STEI',
          jurusan: 'Teknik Informatika',
          imagePath: 'ini path',
          groupId: group1.id,
        }
      }
    }
  });
  console.log(user2);

  const user3 = await prisma.user.create({
    data: {
      nim: '13520000',
      passwordHash: await hash('13520000', 10),
      role: 'STUDENT',
      student: {
        create: {
          gender: 'MALE',
          firstName: 'Bob',
          lastName: 'Kanggara',
          fakultas: 'STEI',
          jurusan: 'Teknik Informatika',
          imagePath: 'ini path',
          groupId: group1.id
        }
      }
    }
  });
  console.log(user3)

  const user4 = await prisma.user.create({
    data: {
      nim: '13521000',
      passwordHash: await hash('13521000', 10),
      role: 'STUDENT',
      student: {
        create: {
          gender: 'MALE',
          firstName: 'Bab',
          lastName: 'Kanggara',
          fakultas: 'STEI',
          jurusan: 'Teknik Informatika',
          imagePath: 'ini path',
          groupId: group2.id
        }
      }
    }
  });
  console.log(user4)

  const event = await prisma.event.create({
    data: {
      title: 'Event 1',
      materialPath: 'ini path ke material',
      startTime: new Date(2023, 5, 16, 10, 0, 0),
      endTime: new Date(2023, 5, 16, 12, 0, 0)
    }
  });
  console.log(event);

  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Test Assignment',
      description: 'Sebuah description',
      deadline: new Date(2023, 5, 30, 10, 0, 0),
    }
  })

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'Test Assignment 2',
      description: 'Sebuah description',
      deadline: new Date(2023, 6, 30, 10, 0, 0),
    }
  })

  const student = await prisma.student.findFirst({
    where: {
      userId: user2.id
    }
  })

  const student2 = await prisma.student.findFirst({
    where: {
      userId: user3.id
    }
  })

  const student3 = await prisma.student.findFirst({
    where: {
      userId: user4.id
    }
  })

  if (student && student2 && student3) {
    const assignmentSubmission = await prisma.assignmentSubmission.createMany({
      data: [
        {
          filePath: "hello.pdf",
          studentId: student.id,
          assignmentId: assignment1.id,
        },
        {
          filePath: "helloworld.pdf",
          studentId: student.id,
          assignmentId: assignment2.id,
        },
        {
          filePath: "helloworld2.pdf",
          studentId: student2.id,
          assignmentId: assignment2.id,
        },
        {
          filePath: "helloworld3.pdf",
          studentId: student2.id,
          assignmentId: assignment2.id,
        },
        {
          filePath: "helloworld4.pdf",
          studentId: student3.id,
          assignmentId: assignment2.id,
        },
        {
          filePath: "helloworld5.pdf",
          studentId: student3.id,
          assignmentId: assignment2.id,
        },
      ]
    })
    console.log(assignmentSubmission)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
