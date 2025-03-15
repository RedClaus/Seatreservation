import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0052CC', // Brand Blue
    secondary: '#36B37E', // Brand Green
    error: '#FF5630', // Brand Red
    warning: '#FFAB00', // Brand Amber
    background: '#f5f5f5',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: '100',
    },
  },
};
