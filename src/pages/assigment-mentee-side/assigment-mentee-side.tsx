/* eslint-disable @typescript-eslint/require-await */
import Head from 'next/head';
import { api } from '~/utils/api';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Spacer,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Input,
  Icon,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { MdOutlineFileUpload } from 'react-icons/md';

function NavBar() {
  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      padding='1rem 3rem 1rem 1rem'
      color='white'
    >
      {/* Replace the src and alt attributes with your logo */}
      <Image src='/' alt='Logo Dikpus' padding={'3rem 3rem 3rem 5%'} />
      <HStack spacing={'1.5rem'}>
        <Text fontSize='64px' fontWeight='bold'>
          Tugas
        </Text>
        <Spacer />
        <IconButton
          variant='ghost'
          aria-label='Menu'
          color={'white'}
          _hover={{ color: 'black', background: 'white' }}
          fontSize='36px'
          boxSize={'4rem'}
          icon={<HamburgerIcon />}
        />
      </HStack>
    </Flex>
  );
}

function DropDownMenu() {
  return (
    <Flex padding={'0px 0px 0px 5%'}>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          margin={'3rem 3rem 3rem 0'}
          padding={'10px 20px 10px'}
          color={'white'}
          background={'#1C939A'}
          borderRadius={'0px'}
          variant={'unstyled'}
          size={'24px'}
          fontWeight={'medium'}
        >
          Pilih tugas
        </MenuButton>
        <MenuList>
          <MenuItem>Download</MenuItem>
          <MenuItem>Create a Copy</MenuItem>
          <MenuItem>Mark as Draft</MenuItem>
          <MenuItem>Delete</MenuItem>
          <MenuItem>Attend a Workshop</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

function AssignmentDetails() {
  return (
    <Box>
      <Flex
        color='white'
        padding={'0px 0px 0px 5%'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box width='1400px'>
          <Text fontSize={'40px'} fontWeight={'700'}>
            Lorem ipsum dolor sit amet,
          </Text>
        </Box>
        <Box
          w='300px'
          justifyContent={'right'}
          marginRight={'5.5%'}
          marginLeft={'25%'}
        >
          <Text fontSize={'20px'} fontWeight={'700'} padding={'0px'}>
            Lorem ipsum dolor sit
          </Text>
        </Box>
      </Flex>
      <Flex
        color='white'
        padding={'0px 0 0px 5%'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box width='1400px'>
          <Text fontSize={'20px'} fontWeight={'400'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            ultrices nulla sit amet luctus tristique. Pellentesque tempor neque
            viverra, ornare lorem eu, finibus felis. Nulla id lacinia sem. Nunc
            blandit eros at risus convallis, ac iaculis tellus blandit. Etiam
            porttitor ex sit amet nisi finibus, vitae finibus leo bibendum. Sed
            ex odio, pulvinar at pulvinar vitae, pharetra vel orci. Aenean
            commodo fringilla finibus. Maecenas a commodo quam. Phasellus vitae
            neque dignissim, tincidunt nisl et, lobortis nunc. Ut vitae mauris
            ipsum. Fusce finibus, mauris at auctor lacinia, elit velit convallis
            massa, a feugiat ligula nisi vel ex. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas.
          </Text>
        </Box>
        <Box w='300px' justifyContent={'left'} padding={'0px 0 0px 13%'}>
          <Text fontSize={'12px'} fontWeight={'700'}>
            Status :
          </Text>
        </Box>
        <Box
          w='250px'
          marginRight={'6.5%'}
          marginLeft={'0px'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={'8px'}
          width={'160px'}
          background={'#E6FEED'}
          border={'2px solid #069154'}
          borderRadius={'12px'}
        >
          <Text
            fontSize={'12px'}
            fontWeight={'700'}
            color={'#069154'}
            justifyContent={'center'}
            alignItems={'center'}
            padding={'0px 0px 0px 13%'}
          >
            Belum terkumpul
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

function UploadSection() {
  return (
    <Box>
      <Flex
        background={
          'linear-gradient(180deg, rgba(28, 147, 154, 0.1) 0%, rgba(28, 147, 154, 0.069) 100%);'
        }
        position={'absolute'}
        margin={'32.5px 100px 0px 5%'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'300px'}
        width={'90%'}
        borderRadius={'16px'}
        border={'1px dashed #1C939A'}
      >
        <Icon
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          as={MdOutlineFileUpload}
          w={8}
          h={8}
          position={'absolute'}
          alignItems={'center'}
          color={'#117584'}
          background={'transparent'}
          boxSize={'50px'}
          top={'25%'}
        />
        <Flex
          flexDirection={'column'}
          alignItems={'center'}
          padding={'12px'}
          gap={'12px'}
          position={'absolute'}
          left={'10%'}
          right={'10%'}
          top={'38.33%'}
          bottom={'8.33%'}
        >
          <Text fontSize={'20px'} fontWeight={'400'} color={'#1C939A'}>
            Drag & Drop your files here
          </Text>
          <Text fontSize={'20px'} fontWeight={'400'} color={'#1C939A'}>
            OR
          </Text>
          <Button
            padding={'0px 40px 0px 40px'}
            backgroundColor={'#1C939A'}
            color={'white'}
            filter={'drop-shadow(0px 8px 16px rgba(28, 147, 154, 0.74));'}
            fontWeight={'normal'}
            _hover={{ background: '#117584' }}
            cursor={'pointer'}
          >
            Browse Files
          </Button>
          <form action=''></form>
          <Input
            type='file'
            style={{ display: 'none' }}
            className='input-field'
          ></Input>
        </Flex>
      </Flex>
      <Flex justifyContent={'right'} marginRight={'5%'} paddingTop={'350px'}>
        <Button
          padding={'0px 40px 0px 20px'}
          backgroundColor={'#1C939A'}
          color={'white'}
          fontWeight={'normal'}
          _hover={{ background: '#117584' }}
          cursor={'pointer'}
        >
          <Text marginRight={'10px'} marginTop={'2px'}>
            Upload{' '}
          </Text>
          <Icon
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            as={MdOutlineFileUpload}
            w={8}
            h={8}
            marginRight={'-30px'}
            color={'white'}
          />
        </Button>
      </Flex>
    </Box>
  );
}

function AssigmentMenteeSidePage() {
  return (
    <>
      <Head>
        <title>Assignment - KAT ITB 2023</title>
      </Head>
      <NavBar></NavBar>
      <DropDownMenu></DropDownMenu>
      <AssignmentDetails></AssignmentDetails>
      <UploadSection></UploadSection>
    </>
  );
}

export default AssigmentMenteeSidePage;
