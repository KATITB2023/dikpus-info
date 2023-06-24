import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

interface RawData {
  nim: string;
  classId: string;
}

async function main() {
  const groupFilePath = path.resolve(__dirname, "data/student-class-issue.csv");
  const groupFileContent = fs.readFileSync(groupFilePath, {
    encoding: "utf-8"
  });

  parse(
    groupFileContent,
    {
      delimiter: ",",
      columns: ["nim", "classId"]
    },
    async (err, records: RawData[]) => {
      if (err) console.error(err);
      const studentClass = await Promise.all(
        records.map(async (record) => {
          const student = await prisma.student.findFirst({
            where: {
              user: {
                nim: record.nim
              }
            }
          });

          if (!student) throw new Error(`Student ${record.nim} not found`);

          try {
            return await prisma.studentClass.create({
              data: {
                studentId: student.id,
                classId: record.classId
              }
            });
          } catch (e) {
            throw new Error(
              `Record ${record.nim} ${record.classId} violates constraint`
            );
          }
        })
      );
      console.log(studentClass);
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
