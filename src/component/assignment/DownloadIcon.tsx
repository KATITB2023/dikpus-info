import Image from "next/image";

export default function DownloadIcon() {
  return (
    <Image
      priority
      src='/logo/download.svg'
      alt='Download'
      width={36}
      height={36}
    />
  );
}
