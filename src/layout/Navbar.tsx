import {
  Flex,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import Link from 'next/link';
import { AiOutlineHome } from 'react-icons/ai';
import { BsPeopleFill } from 'react-icons/bs';
import { MdOutlineFolderCopy } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';

interface Props {
  title: string;
  titleOnly?: boolean;
}

export default function Navbar({ title, titleOnly = false }: Props) {
  // TODO: ganti link
  const links = [
    { name: 'Profile', href: '/', icon: <AiOutlineHome size={20} /> },
    { name: 'Absen', href: '/', icon: <BsPeopleFill size={20} /> },
    { name: 'Tugas', href: '/', icon: <MdOutlineFolderCopy size={20} /> }
  ];

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
              {links.map((link, idx) => {
                return (
                  <Link href={link.href} key={idx}>
                    <MenuItem
                      bg='#1C939A'
                      w='100%'
                      _hover={{ opacity: 0.7, bg: '#12122E' }}
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
            </MenuList>
          </Menu>
        </HStack>
      ) : null}
    </Flex>
  );
}
