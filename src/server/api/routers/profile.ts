import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfile:studentProcedure
    .input(z.object({userId:z.string()}))
    .query(async({ctx,input})=>{
      // DATA
      const data={
        nim : "",
        gender:"",
        firstName:"",
        lastName:"",
        fakultas:"",
        jurusan:"",
        phoneNumber:"",
        imagePath:"",
        accepted:false,
        userId:"",
        mentorId:"",
        createdAt:new Date(),
        updatedAt:new Date(),
        zoomLink:"",
        group:"",
      }

      //NIM
      const user=await ctx.prisma.user.findFirst({
        where:{
          id:input.userId
        }
      })
      
      //STUDENT
      const student=await ctx.prisma.student.findFirst({
        where:{
          id:input.userId
        }
      })

      //MENTOR
      const mentor=await ctx.prisma.mentor.findFirst({
        where:{
          userId:student?.mentorId
        }
      })

      //INSERT DATA
      data.nim = user?.nim ?? "";
      data.gender = student?.gender ?? "";
      data.firstName = student?.firstName ?? "";
      data.lastName = student?.lastName ?? "";
      data.fakultas = student?.fakultas ?? "";
      data.jurusan = student?.jurusan ?? "";
      data.phoneNumber = student?.phoneNumber ?? "";
      data.imagePath = student?.imagePath ?? "";
      data.accepted = student?.accepted ?? false;
      data.userId = user?.id ?? "";
      data.mentorId = student?.mentorId ?? "";
      data.createdAt = student?.createdAt ?? new Date();
      data.updatedAt = student?.updatedAt ?? new Date();
      data.zoomLink = mentor?.zoomLink ?? "";
      data.group = mentor?.group ?? "";

      return data
    }),
  editProfile: studentProcedure
    .input(
      z.object({ 
        userId: z.string(),
        profile_url: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        phoneNumber: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      
      const student=await ctx.prisma.student.findFirst({
        where:{
          id:input.userId
        }
      })
      return await ctx.prisma.student.update({
        where:{
          id:input.userId
        },
        data:{
          imagePath:input.profile_url=="" ? student?.imagePath : input.profile_url,
          firstName:input.firstName=="" ? student?.firstName : input.firstName,
          lastName:input.lastName=="" ? student?.lastName : input.lastName,
          phoneNumber:input.phoneNumber=="" ? student?.phoneNumber : input.phoneNumber,
        }
      });
    })
});
