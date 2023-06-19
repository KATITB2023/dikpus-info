import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

interface GroupRawData {
  number: string;
  zoomLink: string;
}

async function main() {
  const groupFilePath = path.resolve(__dirname, "data/group.csv");
  const groupFileContent = fs.readFileSync(groupFilePath, {
    encoding: "utf-8"
  });
  parse(
    groupFileContent,
    {
      delimiter: ",",
      columns: Object.keys({
        number: new String(),
        zoomLink: new String()
      } as GroupRawData)
    },
    async (err, records: GroupRawData[]) => {
      if (err) console.error(err);
      const groups = await Promise.all(
        records.map(async (record) => {
          return await prisma.group.create({
            data: {
              group: parseInt(record.number),
              zoomLink: record.zoomLink
            }
          });
        })
      );
      console.log(groups);
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
