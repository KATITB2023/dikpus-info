import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Bodwars',
    body: 'SomarRounded-Regular'
  },
  styles: {
    global: {
      body: {
        bg: '#12122E',
        color: 'white'
      },
      '*': {
        '&::-webkit-scrollbar': {
          w: '2'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#1C939A',
          borderRadius: '4'
        }
      }
    }
  }
});

export default theme;
