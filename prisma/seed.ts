import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      nim: '13520104',
      passwordHash: await hash('13520104', 10),
      role: 'MENTOR',
      mentor: {
        create: {
          group: 'A',
          zoomLink: 'ini link zoom'
        }
      }
    }
  });

  console.log(user1);

  const mentorId = await prisma.mentor.findFirst({
    where: {
      userId: user1.id
    },
    select: {
      id: true
    }
  });

  if (!mentorId) {
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
          mentorId: mentorId.id
        }
      }
    }
  });
  console.log(user2);

  const event = await prisma.event.create({
    data: {
      title: 'Event 1',
      materialPath: 'ini path ke material',
      startTime: new Date(2023, 5, 16, 10, 0, 0),
      endTime: new Date(2023, 5, 16, 12, 0, 0)
    }
  });
  console.log(event);
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
