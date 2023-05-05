import 'vuetify/styles';
import { createVuetify, ThemeDefinition } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#F2F2F2',
    surface: '#FFFFFF',
    primary: '#4CAF50', // primary green
    'primary-darken-1': '#388E3C', // darker green
    secondary: '#03A9F4', // blue
    'secondary-darken-1': '#0288D1', // darker blue
    error: '#F44336', // red
    info: '#2196F3', // light blue
    success: '#8BC34A', // light green
    warning: '#FFC107', // yellow
  },
};

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
});
