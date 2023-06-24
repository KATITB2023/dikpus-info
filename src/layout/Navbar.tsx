import {
  Flex,
  HStack,
  Heading,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from "@chakra-ui/react";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeopleFill, BsCameraVideoFill } from "react-icons/bs";
import {
  MdOutlineFolderCopy,
  MdOutlineLogout,
  MdPassword
} from "react-icons/md";
import { FaYoutube, FaUniversity } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { signOut, useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

interface Props {
  title: string;
  titleOnly?: boolean;
}

export default function Navbar({ title, titleOnly }: Props) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? UserRole.MENTOR;

  const links = {
    [UserRole.STUDENT]: [
      { name: "Profile", href: "/profile", icon: <AiOutlineHome size={20} /> },
      { name: "Absen", href: "/attendance", icon: <BsPeopleFill size={20} /> },
      {
        name: "Tugas",
        href: "/assignment",
        icon: <MdOutlineFolderCopy size={20} />
      },
      {
        name: "Live",
        href: "/live",
        icon: <FaYoutube size={20} />
      },
      {
        name: "Ekskul",
        href: "/ekskul",
        icon: <FaUniversity size={20} />
      },
      {
        name: "Password",
        href: "/changepassword",
        icon: <MdPassword size={20} />
      }
    ],
    [UserRole.MENTOR]: [
      { name: "Absen", href: "/attendance", icon: <BsPeopleFill size={20} /> },
      {
        name: "Tugas",
        href: "/assignment",
        icon: <MdOutlineFolderCopy size={20} />
      },
      {
        name: "Zoom",
        href: "/changezoom",
        icon: <BsCameraVideoFill size={20} />
      },
      {
        name: "Password",
        href: "/changepassword",
        icon: <MdPassword size={20} />
      }
    ]
  };

  return (
    <Flex
      flexDir='row'
      justifyContent='space-between'
      alignItems='center'
      px={{ base: 7, lg: 12 }}
      py={7}
    >
      <Img src='/logotype.png' alt='logo' height={16} />
      {!titleOnly ? (
        <HStack spacing={8}>
          <Heading
            fontSize='2xl'
            pt={1.5}
            display={{ base: "none", sm: "block" }}
          >
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
                onClick={() =>
                  void signOut({
                    callbackUrl: "/"
                  })
                }
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
