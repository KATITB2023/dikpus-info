import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  studentProcedure
} from '~/server/api/trpc';
import { compare, hash } from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { env } from '~/env.mjs';

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
    }),

  changePass: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        cur_pass: z.string(),
        new_pass: z.string(),
        repeat_pass: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.userId
        },
        select: {
          passwordHash: true
        }
      });

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User not found'
        });
      }

      const isValid = await compare(input.cur_pass, user.passwordHash);
      if (!isValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Incorrect current password'
        });
      }

      if (input.repeat_pass.localeCompare(input.new_pass) !== 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "Confirmation password doesn't match"
        });
      }

      const saltRounds = env.BCRYPT_SALT;

      return await ctx.prisma.user.update({
        where: {
          id: input.userId
        },
        data: {
          passwordHash: await hash(input.new_pass, saltRounds)
        }
      });
    })
});
