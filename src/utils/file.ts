import axios, { type AxiosProgressEvent } from 'axios';

export enum FolderEnum {
  PROFILE = 'profile',
  ASSIGNMENT = 'assignment'
}

export enum AllowableFileTypeEnum {
  PDF = 'application/pdf',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  JPG = 'image/jpg'
}

export const uploadFile = async (
  url: string,
  file: File,
  type: AllowableFileTypeEnum,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const axiosInstance = axios.create();

  await axiosInstance.put<null>(url, file, {
    headers: {
      'Content-Type': type
    },
    onUploadProgress
  });
};
