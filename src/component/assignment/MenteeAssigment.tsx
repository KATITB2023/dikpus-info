/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "~/utils/api";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  useToast,
  Progress
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MdOutlineFileUpload } from "react-icons/md";
import { FolderEnum, AllowableFileTypeEnum, uploadFile } from "~/utils/file";
import { TRPCClientError } from "@trpc/client";

function AssignmentBox({ tugas, userId }: { tugas: any; userId: string }) {
  const toast = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const generateURLMutation = api.storage.generateURLForUpload.useMutation();
  const uploadMutation = api.assignment.updateSubmission.useMutation();

  const pastDeadline = new Date(Date.now()) > new Date(tugas.deadline);
  const submitted = tugas.submission[0].filePath !== null;
  const isRed = pastDeadline || !submitted;

  const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile) return;

      setFile(droppedFile);
      setIsDragActive(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    setFile(file);
  };

  const uploadFileButton = (title: string) => {
    document.getElementById(`browse-files-${title}`)?.click();
  };

  const handleOnClick = async () => {
    if (!file) return;

    setLoading(true);
    const { url: uploadURL, sanitizedFilename } =
      await generateURLMutation.mutateAsync({
        folder: FolderEnum.ASSIGNMENT,
        filename: file.name,
        contentType: AllowableFileTypeEnum.PDF
      });

    await uploadFile(uploadURL, file, AllowableFileTypeEnum.PDF, (event) => {
      if (!event.total) return;
    });

    try {
      const result = await uploadMutation.mutateAsync({
        assignmentId: tugas.id ?? "",
        userId,
        fileUrl: sanitizedFilename
      });
      toast({
        title: "Success",
        status: "success",
        description: result?.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });

      document.getElementById(tugas.id)!.style.border = "2px solid #069154";
      document.getElementById(tugas.id)!.style.background = "#E6FEED";
      document.getElementById(tugas.id)!.style.color = "#069154";
      document.getElementById(tugas.id)!.innerHTML = "Sudah terkumpul";
      document.getElementById(`drag-drop-${tugas.id}`)!.style.display = "none";
    } catch (err: unknown) {
      if (!(err instanceof TRPCClientError)) throw err;

      toast({
        title: "Failed",
        status: "error",
        description: err.message,
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }

    setFile(null);
    setLoading(false);
  };
  return (
    <Flex flexDir={"column"} id={tugas.title} display={""}>
      <Flex
        flexDir='row'
        justifyContent='space-between'
        alignItems='bottom'
        paddingTop={12}
        flexWrap='wrap'
        gap={{ base: 4, lg: 0 }}
      >
        <Flex flexDir='column' alignItems='left' marginRight={"30px"}>
          <Text fontSize='2xl' fontWeight={"700"} maxW={1200}>
            {tugas.title}
          </Text>
          <Text fontSize='xl' fontWeight={"400"} maxW={1200}>
            {tugas.description}
          </Text>
        </Flex>
        <Flex
          flexDir='column'
          alignItems={{ base: "flex-start", lg: "flex-end" }}
          alignSelf='center'
          gap={1}
        >
          <Box display={"inline-flex"} justifyItems='left' alignItems='bottom'>
            <Text fontSize={"20px"} fontWeight={"700"}>
              Deadline :{" "}
              {tugas.deadline?.toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </Text>
          </Box>
          <Box display={"inline-flex"} justifyItems='left'>
            <Text fontSize={"12px"} fontWeight={"700"} alignSelf='center'>
              Status :
            </Text>
            <Text
              id={tugas.id}
              fontSize={"12px"}
              fontWeight={"700"}
              justifyContent={"center"}
              alignContent={"center"}
              margin={"0px 0px 0px 15px"}
              borderRadius={"12px"}
              padding={"0px 30px"}
              color={!isRed ? "#069154" : "#F43518"}
              background={!isRed ? "#E6FEED" : "#FEE9E6"}
              border={!isRed ? "2px solid #069154" : "2px solid #F43518"}
            >
              {pastDeadline
                ? "Tidak mengumpulkan"
                : submitted
                ? "Sudah terkumpul"
                : "Belum terkumpul"}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex
        id={`drag-drop-${tugas.id}`}
        flexDir='column'
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        display={submitted ? "none" : "flex"}
      >
        <Flex
          background={
            "linear-gradient(180deg, rgba(28, 147, 154, 0.1) 0%, rgba(28, 147, 154, 0.069) 100%);"
          }
          margin={"32.5px 0px 0px 0%"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"300px"}
          width={"100%"}
          borderRadius={"16px"}
          border={"1px dashed #1C939A"}
          flexDir={"column"}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            background: isDragActive ? "#117584" : "none",
            border: isDragActive ? "2px dashed #1C939A" : "1px dashed #1C939A"
          }}
        >
          <MdOutlineFileUpload
            size={"70px"}
            color='117584'
          ></MdOutlineFileUpload>
          <Text
            fontSize={"20px"}
            fontWeight={"400"}
            color={"#1C939A"}
            textAlign='center'
          >
            Drag & Drop your files here
          </Text>
          <Text
            fontSize={"20px"}
            fontWeight={"400"}
            color={"#1C939A"}
            py={"10px"}
          >
            OR
          </Text>
          <input
            type='file'
            onChange={handleFileChange}
            style={{ display: "none" }}
            id={`browse-files-${tugas.title}`}
          />
          <Button
            padding={"0px 40px 0px 40px"}
            backgroundColor={"#1C939A"}
            color={"white"}
            filter={"drop-shadow(0px 8px 16px rgba(28, 147, 154, 0.74));"}
            fontWeight={"normal"}
            _hover={{ background: "#117584" }}
            cursor={"pointer"}
            onClick={() => void uploadFileButton(tugas.title)}
          >
            Browse Files
          </Button>
        </Flex>
        {loading ? (
          <Progress size='sm' isIndeterminate bg='transparent' mt={5} />
        ) : (
          <>
            <Text mt={3} key={file ? file.name : ""}>
              {file ? `File: ${file.name}` : ""}
            </Text>
            <Flex
              className={tugas.title}
              justifyContent={"flex-end"}
              marginTop={"18px"}
              marginBottom={"18px"}
              visibility={submitted || pastDeadline ? "hidden" : "visible"}
            >
              {" "}
              <Button
                padding={"0px 40px 0px 20px"}
                backgroundColor={"#1C939A"}
                color={"white"}
                fontWeight={"normal"}
                _hover={{ background: "#117584" }}
                cursor={"pointer"}
                onClick={() => void handleOnClick()}
              >
                <Text
                  marginRight={"10px"}
                  marginTop={"2px"}
                  marginBottom={"2px"}
                  fontSize='lg'
                >
                  Upload{" "}
                </Text>
                <Icon
                  as={MdOutlineFileUpload}
                  w={7}
                  h={7}
                  marginRight={"-30px"}
                  color={"white"}
                />
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default function MenteeAssigment() {
  const { data: session } = useSession();
  const assignments = api.assignment.getAssignmentNameList.useQuery().data;
  const assignmentsDetails = api.assignment.getAssignmentDescription.useQuery({
    userId: session?.user.id ?? ""
  }).data;

  const handleFilterAssignment: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    const target = e.target as HTMLButtonElement;
    filterAssignment(target.name);
  };

  const filterAssignment = (title: string) => {
    if (title === "all") {
      assignmentsDetails?.map((item) => {
        document.getElementById(item.title)!.style.display = "";
      });
    } else {
      assignmentsDetails?.map((item) => {
        if (item.title === title) {
          document.getElementById(item.title)!.style.display = "";
        } else {
          document.getElementById(item.title)!.style.display = "none";
        }
      });
    }
  };

  if (assignments && assignments.length > 0) {
    return (
      <>
        <Flex>
          <Menu>
            <MenuButton
              as={Button}
              padding={"0px 5px 0px 0px"}
              background={"#1C939A"}
              borderRadius={"0px"}
              variant={"unstyled"}
              _hover={{ bg: "#117584" }}
              fontWeight={"medium"}
            >
              <Flex
                flexDir='row'
                justifyContent='space-between'
                alignItems='center'
                w='150px'
                px={2}
              >
                <Text fontSize='lg'>Pilih tugas</Text>
                <ChevronDownIcon fontSize={"20px"} />
              </Flex>
            </MenuButton>
            <MenuList bg='#1C939A' border='none' borderRadius='xl' py={3}>
              <MenuItem
                name='all'
                bg='#1C939A'
                w='100%'
                _hover={{ opacity: 0.7, bg: "#12122E" }}
                transition='all 0.2s ease-in-out'
                px={"20px"}
                onClick={handleFilterAssignment}
              >
                Semua tugas
              </MenuItem>
              {assignments.map((item, index: number) => {
                return (
                  <MenuItem
                    key={index}
                    name={item.title}
                    bg='#1C939A'
                    w='100%'
                    _hover={{ opacity: 0.7, bg: "#12122E" }}
                    transition='all 0.2s ease-in-out'
                    px={"20px"}
                    onClick={handleFilterAssignment}
                  >
                    {item.title}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        </Flex>
        {assignmentsDetails?.map((item, index: number) => {
          return (
            <Box key={index}>
              <AssignmentBox
                tugas={item}
                userId={session?.user.id ?? ""}
              ></AssignmentBox>
            </Box>
          );
        })}
      </>
    );
  }

  return (
    <Text textAlign='center'>
      Yeay, untuk sekarang kamu tidak memiliki tugas yang harus dikerjakan
    </Text>
  );
}
