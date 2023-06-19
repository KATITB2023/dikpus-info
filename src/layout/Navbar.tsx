import {
  Flex,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from "@chakra-ui/react";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { MdOutlineFolderCopy, MdOutlineLogout } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { signOut, useSession } from "next-auth/react";

interface Props {
  title: string;
  titleOnly?: boolean;
}

export default function Navbar({ title, titleOnly }: Props) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "MENTOR";

  const links = {
    STUDENT: [
      { name: "Profile", href: "/profile", icon: <AiOutlineHome size={20} /> },
      { name: "Absen", href: "/attendance", icon: <BsPeopleFill size={20} /> },
      {
        name: "Tugas",
        href: "/assignment",
        icon: <MdOutlineFolderCopy size={20} />
      }
    ],
    MENTOR: [
      { name: "Absen", href: "/attendance", icon: <BsPeopleFill size={20} /> },
      {
        name: "Tugas",
        href: "/assignment",
        icon: <MdOutlineFolderCopy size={20} />
      }
    ]
  };
  // TODO ganti logo dikpus

  return (
    <Flex
      flexDir='row'
      justifyContent='space-between'
      alignItems='center'
      px={12}
      py={7}
    >
      <Text as='b' fontSize='2xl'>
        Logo Dikpus
      </Text>
      {!titleOnly ? (
        <HStack spacing={8}>
          {/* idk, bodwars fontnya stick ke atas.. */}
          <Heading fontSize='2xl' pt={1.5}>
            {title}
          </Heading>
          <Menu isLazy>
            <MenuButton
              _hover={{ opacity: 0.7 }}
              transition='all 0.2s ease-in-out'
              cursor='pointer'
            >
              <RxHamburgerMenu size={24} />
            </MenuButton>
            <MenuList bg='#1C939A' border='none' borderRadius='xl' py={3}>
              {links[role].map((link, idx) => {
                return (
                  <Link href={link.href} key={idx}>
                    <MenuItem
                      bg='#1C939A'
                      w='100%'
                      _hover={{ bg: "#2FC1AD" }}
                      transition='all 0.2s ease-in-out'
                    >
                      <Flex
                        flexDir='row'
                        justifyContent='space-between'
                        alignItems='center'
                        w='100%'
                        px={2}
                      >
                        <Text fontSize='xl'>{link.name}</Text>
                        {link.icon}
                      </Flex>
                    </MenuItem>
                  </Link>
                );
              })}
              <MenuItem
                bg='#1C939A'
                w='100%'
                _hover={{ bg: "#2FC1AD" }}
                transition='all 0.2s ease-in-out'
                onClick={() => void signOut()}
              >
                <Flex
                  flexDir='row'
                  justifyContent='space-between'
                  alignItems='center'
                  w='100%'
                  px={2}
                >
                  <Text fontSize='xl'>Log Out</Text>
                  <MdOutlineLogout size={20} />
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      ) : null}
    </Flex>
  );
}
