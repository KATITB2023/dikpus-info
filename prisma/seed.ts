/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Group, PrismaClient, type User } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const students = [
  {
    nim: '13520001',
    passwordHash: '13520001',
    firstName: 'Talha',
    lastName: 'Rodgers',
    fakultas: 'STEI',
    jurusan: 'Teknik Informatika'
  },
  {
    nim: '13520002',
    passwordHash: '13520002',
    firstName: 'Emil',
    lastName: 'Holloway',
    fakultas: 'STEI',
    jurusan: 'Sistem dan Teknologi Informasi'
  },
  {
    nim: '13520003',
    passwordHash: '13520003',
    firstName: 'Valerie',
    lastName: 'Conley',
    fakultas: 'STEI',
    jurusan: 'Teknik  Biomedis'
  },
  {
    nim: '13520004',
    passwordHash: '13520004',
    firstName: 'Christine',
    lastName: 'Hendrix',
    fakultas: 'FSRD',
    jurusan: 'Desain Interior'
  },
  {
    nim: '13520005',
    passwordHash: '13520005',
    firstName: 'Felix',
    lastName: 'Wiley',
    fakultas: 'FSRD',
    jurusan: 'DKV'
  },
  {
    nim: '13520006',
    passwordHash: '13520006',
    firstName: 'Leyton',
    lastName: 'Tyler',
    fakultas: 'FTMD',
    jurusan: 'Teknik Mesin'
  },
  {
    nim: '13520007',
    passwordHash: '13520007',
    firstName: 'Caitlin',
    lastName: 'Holman',
    fakultas: 'FTTM',
    jurusan: 'Teknik Geofisika'
  },
  {
    nim: '13520008',
    passwordHash: '13520008',
    firstName: 'Sahar',
    lastName: 'Montoya',
    fakultas: 'FTTM',
    jurusan: 'Teknik Perminyakan'
  },
  {
    nim: '13520009',
    passwordHash: '13520009',
    firstName: 'Kayne',
    lastName: 'Walker',
    fakultas: 'FTSL',
    jurusan: 'Teknik Sipil'
  },
  {
    nim: '13520010',
    passwordHash: '13520010',
    firstName: 'Tanya',
    lastName: 'Shelton',
    fakultas: 'FTI',
    jurusan: 'Teknik Fisika'
  }
];

const mentors = [
  {
    nim: '13520100',
    passwordHash: '13520100'
  },
  {
    nim: '13520101',
    passwordHash: '13520101'
  },
  {
    nim: '13520102',
    passwordHash: '13520102'
  },
  {
    nim: '13520103',
    passwordHash: '13520103'
  },
  {
    nim: '13520104',
    passwordHash: '13520104'
  }
];

const groups = [
  {
    group: 1,
    zoomLink: 'http://zoom-kelompok-1'
  },
  {
    group: 2,
    zoomLink: 'http://zoom-kelompok-2'
  },
  {
    group: 3,
    zoomLink: 'http://zoom-kelompok-3'
  }
];

async function main() {
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const groupsData: Group[] = [];
  for (const group of groups) {
    const result = await prisma.group.create({
      data: {
        group: group.group,
        zoomLink: group.zoomLink
      }
    });

    groupsData.push(result);
  }

  const studentsData: User[] = [];
  for (const student of students) {
    const result = await prisma.user.create({
      data: {
        nim: student.nim,
        passwordHash: await hash(student.passwordHash, 10),
        role: 'STUDENT',
        student: {
          create: {
            firstName: student.firstName,
            lastName: student.lastName,
            fakultas: student.fakultas,
            jurusan: student.jurusan,
            groupId: groupsData[getRandomInt(3)]!.id
          }
        }
      }
    });
    studentsData.push(result);
  }

  const mentorsData: User[] = [];
  for (const mentor of mentors) {
    const result = await prisma.user.create({
      data: {
        nim: mentor.nim,
        passwordHash: await hash(mentor.passwordHash, 10),
        role: 'MENTOR',
        mentor: {
          create: {}
        }
      }
    });
    mentorsData.push(result);
  }

  const groupIds = await prisma.group.findMany({
    select: {
      id: true
    }
  });

  const mentorIds = await prisma.mentor.findMany({
    select: {
      id: true
    }
  });

  const mentorGroup1 = await prisma.mentorGroup.create({
    data: {
      mentorId: mentorIds[0]!.id,
      groupId: groupIds[0]!.id
    }
  });
  console.log(mentorGroup1);

  const mentorGroup2 = await prisma.mentorGroup.create({
    data: {
      mentorId: mentorIds[1]!.id,
      groupId: groupIds[0]!.id
    }
  });
  console.log(mentorGroup2);

  const mentorGroup3 = await prisma.mentorGroup.create({
    data: {
      mentorId: mentorIds[2]!.id,
      groupId: groupIds[1]!.id
    }
  });
  console.log(mentorGroup3);

  const mentorGroup4 = await prisma.mentorGroup.create({
    data: {
      mentorId: mentorIds[3]!.id,
      groupId: groupIds[2]!.id
    }
  });
  console.log(mentorGroup4);

  const mentorGroup5 = await prisma.mentorGroup.create({
    data: {
      mentorId: mentorIds[4]!.id,
      groupId: groupIds[2]!.id
    }
  });
  console.log(mentorGroup5);
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
