import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  // TODO: add font + colors
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
          w: '0'
        }
      }
    }
  }
});

export default theme;
