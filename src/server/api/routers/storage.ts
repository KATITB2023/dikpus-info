import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import sanitize from 'sanitize-filename';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure
} from '~/server/api/trpc';
import { AllowableFileTypeEnum, FolderEnum } from '~/utils/file';
import { bucket } from '~/server/bucket';
import { env } from '~/env.mjs';

export const storageRouter = createTRPCRouter({
  generateURLForDownload: publicProcedure
    .input(
      z.object({
        folder: z.union([
          z.literal(FolderEnum.PROFILE),
          z.literal(FolderEnum.ASSIGNMENT),
          z.literal(FolderEnum.MATERIAL)
        ]),
        filename: z.string()
      })
    )
    .mutation(async ({ input }) => {
      await bucket.setCorsConfiguration([
        {
          maxAgeSeconds: env.BUCKET_CORS_EXPIRATION_TIME,
          method: ['GET', 'PUT', 'DELETE'],
          origin: ['*'],
          responseHeader: ['Content-Type']
        }
      ]);

      const ref = bucket.file(`${input.folder}/${input.filename}`);

      const [url] = await ref.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + env.URL_EXPIRATION_TIME
      });

      return {
        url
      };
    }),

  generateURLForUpload: protectedProcedure
    .input(
      z.object({
        folder: z.union([
          z.literal(FolderEnum.PROFILE),
          z.literal(FolderEnum.ASSIGNMENT),
          z.literal(FolderEnum.MATERIAL)
        ]),
        filename: z.string(),
        contentType: z.union([
          z.literal(AllowableFileTypeEnum.PDF),
          z.literal(AllowableFileTypeEnum.PNG),
          z.literal(AllowableFileTypeEnum.JPEG),
          z.literal(AllowableFileTypeEnum.JPG)
        ])
      })
    )
    .mutation(async ({ input }) => {
      const fileUUID = uuidv4();
      const sanitizedFileName = sanitize(input.filename);
      const sanitizedFilename = `${fileUUID}-${sanitizedFileName}`;

      await bucket.setCorsConfiguration([
        {
          maxAgeSeconds: env.BUCKET_CORS_EXPIRATION_TIME,
          method: ['GET', 'PUT', 'DELETE'],
          origin: ['*'],
          responseHeader: ['Content-Type']
        }
      ]);

      const ref = bucket.file(`${input.folder}/${sanitizedFilename}`);

      const [url] = await ref.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + env.URL_EXPIRATION_TIME,
        contentType: input.contentType
      });

      return {
        url,
        sanitizedFilename
      };
    }),

  generateURLForDelete: protectedProcedure
    .input(
      z.object({
        folder: z.union([
          z.literal(FolderEnum.PROFILE),
          z.literal(FolderEnum.ASSIGNMENT),
          z.literal(FolderEnum.MATERIAL)
        ]),
        filename: z.string()
      })
    )
    .mutation(async ({ input }) => {
      await bucket.setCorsConfiguration([
        {
          maxAgeSeconds: env.BUCKET_CORS_EXPIRATION_TIME,
          method: ['GET', 'PUT', 'DELETE'],
          origin: ['*'],
          responseHeader: ['Content-Type']
        }
      ]);

      const ref = bucket.file(`${input.folder}/${input.filename}`);

      const [url] = await ref.getSignedUrl({
        version: 'v4',
        action: 'delete',
        expires: Date.now() + env.URL_EXPIRATION_TIME
      });

      return {
        url
      };
    })
});
