import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Flex,
  Text,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  useToast
} from "@chakra-ui/react";
import React from "react";

interface Props {
  children: React.ReactNode;
  accepted: boolean | undefined;
  nama: string | undefined;
  divisi: string | undefined;
  clue: string | undefined;
  link: string | undefined;
}

export const ClueModal = ({
  children,
  accepted,
  nama,
  divisi,
  clue,
  link
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  return (
    <>
      <Flex onClick={onOpen} alignSelf='flex-end'>
        {children}
      </Flex>
      <Modal size='xl' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg='#1C939A' color='white'>
          <ModalCloseButton />
          <ModalHeader fontFamily='heading'>Sangat Rahasia</ModalHeader>
          <ModalBody pb={6}>
            {accepted ? (
              <>
                <Text>
                  Selamat {nama}! Kamu diterima di divisi <b>{divisi}</b> untuk
                  kepanitiaan OSKM 2023 ini! :D
                </Text>
                <Text>
                  <br />
                  Nah sekarang, kamu harus mencari tempat pertemuan pertama
                  divisi kamu. Cari tahu tempat pertemuan kamu dari clue di
                  bawah ini. Tetap semangat ya!! :)
                </Text>
                <Accordion allowToggle mt={5}>
                  <AccordionItem>
                    <AccordionButton>
                      <Text textAlign='left' fontFamily='SomarRounded-Bold'>
                        Clue?? @@
                      </Text>
                    </AccordionButton>
                    <AccordionPanel>
                      <Text textAlign='left'>{clue}</Text>
                      {link ? (
                        <Text textAlign='left'>
                          <br />
                          Link Grup:{" "}
                          <b
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              void navigator.clipboard.writeText(link);
                              toast({
                                title: "Success",
                                description: "Successfully copied to clipboard",
                                status: "success",
                                duration: 2000,
                                position: "top",
                                isClosable: true
                              });
                            }}
                          >
                            {link}
                          </b>
                        </Text>
                      ) : null}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <Text>{clue}</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
