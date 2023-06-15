import Head from 'next/head';
import { api } from '~/utils/api';
import React from 'react';
import {
  Box,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MdOutlineFileUpload } from 'react-icons/md';

interface ArrOfTugasProps {
  arrOfTugas: {
    assignment_id: number;
    title: string;
    description: string;
    deadline: Date;
  }[];
}

function DropDownMenu({ arrOfTugas }: ArrOfTugasProps) {
  return (
    <Flex>
      <Menu>
        <MenuButton
          as={Button}
          margin={'3rem 0rem 0px 0px'}
          padding={'0px 5px 0px 0px'}
          background={'#1C939A'}
          borderRadius={'0px'}
          variant={'unstyled'}
          _hover={{ bg: '#117584' }}
          fontWeight={'medium'}
        >
          <Flex
            flexDir='row'
            justifyContent='space-between'
            alignItems='center'
            w='150px'
            px={2}
          >
            <Text fontSize='20px'>Pilih tugas</Text>
            <ChevronDownIcon fontSize={'20px'} />
          </Flex>
        </MenuButton>
        <MenuList bg='#1C939A' border='none' borderRadius='xl' py={3}>
          {/* TODO
          ISI MENU DENGAN TITLE TUGAS */}
          {arrOfTugas.flatMap((assignment) => {
            return (
              <MenuItem
                bg='#1C939A'
                w='100%'
                _hover={{ opacity: 0.7, bg: '#12122E' }}
                transition='all 0.2s ease-in-out'
                px={'20px'}
                onClick={() =>
                  document.getElementById(assignment.title)?.scrollIntoView({
                    behavior: 'smooth'
                  })
                }
              >
                {assignment.title}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Flex>
  );
}

interface AssignmentProps {
  tugas: {
    assignment_id: number;
    title: string;
    description: string;
    deadline: Date;
  };
}

function AssignmentDetails({ tugas }: AssignmentProps) {
  return (
    <Flex
      flexDir='row'
      justifyContent='space-between'
      alignItems='bottom'
      paddingTop={'45px'}
      id={tugas.title}
    >
      <Flex flexDir='column' alignItems='left' marginRight={'30px'}>
        <Text fontSize={'40px'} fontWeight={'700'} maxW={1200}>
          {tugas.title}
        </Text>
        <Text fontSize={'20px'} fontWeight={'400'} maxW={1200}>
          {tugas.description}
        </Text>
      </Flex>
      <Flex flexDir='column' alignItems='left' alignSelf={'flex-end'}>
        <Box display={'inline-flex'} justifyItems='left' alignItems='bottom'>
          <Text fontSize={'20px'} fontWeight={'700'} marginBottom={5}>
            Deadline :{' '}
            {tugas.deadline.toLocaleString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Text>
        </Box>
        <Box display={'inline-flex'} justifyItems='left'>
          <Text fontSize={'12px'} fontWeight={'700'}>
            Status :
          </Text>
          <Text
            fontSize={'12px'}
            fontWeight={'700'}
            color={'#069154'}
            justifyContent={'center'}
            alignContent={'center'}
            margin={'0px 0px 0px 15px'}
            background={'#E6FEED'}
            border={'2px solid #069154'}
            borderRadius={'12px'}
            padding={'0px 30px'}
          >
            Belum terkumpul
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

function UploadSection() {
  return (
    <Flex flexDir='column' marginBottom={'18px'}>
      <Flex
        background={
          'linear-gradient(180deg, rgba(28, 147, 154, 0.1) 0%, rgba(28, 147, 154, 0.069) 100%);'
        }
        margin={'32.5px 0px 29px 0%'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'300px'}
        width={'100%'}
        borderRadius={'16px'}
        border={'1px dashed #1C939A'}
        flexDir={'column'}
      >
        <svg height='0' width='0'>
          <linearGradient
            id='blue-gradient'
            x1='100%'
            y1='100%'
            x2='0%'
            y2='0%'
          >
            <stop stopColor='#1C939A' offset='0%' />
            <stop stopColor='#117584' offset='100%' />
          </linearGradient>
        </svg>
        <MdOutlineFileUpload
          size={'70px'}
          style={{ fill: 'url(#blue-gradient)' }}
        ></MdOutlineFileUpload>
        <Text fontSize={'20px'} fontWeight={'400'} color={'#1C939A'}>
          Drag & Drop your files here
        </Text>
        <Text
          fontSize={'20px'}
          fontWeight={'400'}
          color={'#1C939A'}
          py={'10px'}
        >
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
      </Flex>
      <Flex justifyContent={'flex-end'}>
        {' '}
        <Button
          padding={'0px 40px 0px 20px'}
          backgroundColor={'#1C939A'}
          color={'white'}
          fontWeight={'normal'}
          _hover={{ background: '#117584' }}
          cursor={'pointer'}
          borderRadius={0}
        >
          <Text
            marginRight={'10px'}
            marginTop={'2px'}
            marginBottom={'2px'}
            fontSize={'24px'}
          >
            Upload{' '}
          </Text>
          <Icon
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            as={MdOutlineFileUpload}
            w={10}
            h={10}
            marginRight={'-30px'}
            color={'white'}
          />
        </Button>
      </Flex>
    </Flex>
  );
}

export default function AssignmentMenteeSidePage() {
  const assignments = [
    {
      assignment_id: 1,
      title: 'Title 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et tempor lorem. Vestibulum volutpat nisi at nulla posuere iaculis. Sed faucibus auctor tincidunt. Praesent porttitor neque ac vulputate venenatis. Integer gravida hendrerit risus non dignissim. Sed pellentesque elit imperdiet dui hendrerit, nec mattis tellus efficitur. Nunc risus arcu, aliquet a nulla ac, lobortis dictum lacus. Ut odio nisl, vestibulum eget scelerisque ac, hendrerit id ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce faucibus est urna, non ultricies dolor aliquet vitae. Praesent ut nulla interdum, semper urna ac, congue eros. Ut vel dictum nisi. In ut justo ex. Proin accumsan, lorem mattis mattis mollis, urna metus lacinia diam, ut varius ligula diam sed leo.',
      deadline: new Date('2022-06-01')
    },
    {
      assignment_id: 2,
      title: 'Title 2',
      description:
        'Vivamus nec libero vitae nisi vestibulum gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel vestibulum felis. Morbi sagittis cursus arcu, non finibus arcu pulvinar in. Nam in erat id arcu condimentum euismod non eu lacus. Donec iaculis in lectus at tristique. Cras porttitor, purus eu blandit convallis, magna lacus ultrices lorem, ac tempus sapien nunc non nunc. Integer lobortis nulla leo, non rutrum arcu sagittis nec.',
      deadline: new Date('2023-06-01')
    },
    {
      assignment_id: 3,
      title: 'Title 3',
      description:
        'Pellentesque id finibus lacus, vitae laoreet arcu. Pellentesque pharetra neque vitae nisl aliquam luctus. In mi ex, volutpat ac erat non, rutrum euismod leo. Donec eu vulputate lacus. Duis bibendum elit dui, a maximus diam tristique eu. In hac habitasse platea dictumst. Fusce et faucibus metus. Nunc blandit maximus ullamcorper. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      deadline: new Date('2024-06-01')
    }
  ];
  return (
    <>
      <DropDownMenu arrOfTugas={assignments}></DropDownMenu>
      {assignments.map((assignment) => {
        return (
          <>
            <AssignmentDetails tugas={assignment}></AssignmentDetails>
            <UploadSection></UploadSection>
          </>
        );
      })}
    </>
  );
}
