import { PrismaClient, UserRole } from "@prisma/client";
import { parse } from "csv-parse";
import { hash } from "bcrypt";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

interface RawData {
  nim: string;
  password: string;
  firstName: string;
  lastName: string;
  fakultas: string;
  rawGroup: string;
}

async function main() {
  const groupFilePath = path.resolve(__dirname, "data/student.csv");
  const groupFileContent = fs.readFileSync(groupFilePath, {
    encoding: "utf-8"
  });

  parse(
    groupFileContent,
    {
      delimiter: ",",
      columns: [
        "nim",
        "password",
        "firstName",
        "lastName",
        "fakultas",
        "rawGroup"
      ]
    },
    async (err, records: RawData[]) => {
      if (err) console.error(err);
      const mentor = await Promise.all(
        records.map(async (record) => {
          const group = await prisma.group.findUnique({
            where: {
              group: parseInt(record.rawGroup)
            }
          });

          if (!group) throw new Error(`Group ${record.rawGroup} not found`);

          return await prisma.user.create({
            data: {
              nim: record.nim,
              passwordHash: await hash(record.password, 10),
              role: UserRole.STUDENT,
              student: {
                create: {
                  firstName: record.firstName,
                  lastName: record.lastName,
                  fakultas: record.fakultas,
                  groupId: group.id
                }
              }
            }
          });
        })
      );
      console.log(mentor);
    }
  );
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
