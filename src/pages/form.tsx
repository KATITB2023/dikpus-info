import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { api } from "~/utils/api";
import { AllowableFileTypeEnum, FolderEnum, uploadFile } from "~/utils/file";

const UploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const generateURLForUpload = api.storage.generateURLForUpload.useMutation();
  const generateURLForDownload =
    api.storage.generateURLForDownload.useMutation();

  const handleOnClick = async () => {
    if (!file) return;

    const { url: uploadURL, sanitizedFilename } =
      await generateURLForUpload.mutateAsync({
        folder: FolderEnum.ASSIGNMENT,
        filename: file.name,
        contentType: AllowableFileTypeEnum.PDF
      });

    await uploadFile(uploadURL, file, AllowableFileTypeEnum.PDF, (event) => {
      if (!event.total) return;

      const newProgress = event.loaded / event.total;
      setProgress(newProgress);
    });

    /** TODO: Variabel "sanitizedFilename" disimpan menggunakan tRPC */

    const { url: downloadURL } = await generateURLForDownload.mutateAsync({
      folder: FolderEnum.ASSIGNMENT,
      filename: sanitizedFilename
    });

    setDownloadURL(downloadURL);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    setFile(file);
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <input
          type='file'
          onChange={handleInputChange}
          accept={AllowableFileTypeEnum.PDF}
        />
        <button onClick={() => void handleOnClick()}>Upload</button>
        <progress value={progress} max={1} />
        <Link href={downloadURL ?? ""} target='_blank'>
          Download
        </Link>
      </main>
    </>
  );
};

export default UploadComponent;
