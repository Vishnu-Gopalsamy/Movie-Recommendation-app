import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#0d47a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e91e63',
      light: '#f48fb1',
      dark: '#c2185b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          },
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 4px 6px -4px rgba(0,0,0,0.08),0px 6px 8px 0px rgba(0,0,0,0.05),0px 2px 16px 0px rgba(0,0,0,0.04)',
    '0px 5px 8px -4px rgba(0,0,0,0.1),0px 8px 10px 1px rgba(0,0,0,0.06),0px 3px 14px 2px rgba(0,0,0,0.04)',
    '0px 5px 10px -3px rgba(0,0,0,0.12),0px 8px 12px 1px rgba(0,0,0,0.07),0px 3px 16px 2px rgba(0,0,0,0.05)',
    '0px 6px 11px -3px rgba(0,0,0,0.13),0px 9px 14px 1px rgba(0,0,0,0.08),0px 3px 16px 2px rgba(0,0,0,0.05)',
    '0px 6px 12px -3px rgba(0,0,0,0.14),0px 10px 15px 1px rgba(0,0,0,0.09),0px 4px 18px 3px rgba(0,0,0,0.05)',
    '0px 6px 13px -3px rgba(0,0,0,0.15),0px 10px 16px 1px rgba(0,0,0,0.1),0px 4px 20px 3px rgba(0,0,0,0.06)',
    '0px 7px 14px -4px rgba(0,0,0,0.16),0px 11px 17px 2px rgba(0,0,0,0.11),0px 4px 22px 4px rgba(0,0,0,0.07)',
    '0px 7px 15px -4px rgba(0,0,0,0.17),0px 12px 18px 2px rgba(0,0,0,0.12),0px 5px 22px 4px rgba(0,0,0,0.08)',
    '0px 8px 16px -5px rgba(0,0,0,0.18),0px 13px 19px 2px rgba(0,0,0,0.13),0px 5px 24px 4px rgba(0,0,0,0.09)',
    '0px 8px 17px -5px rgba(0,0,0,0.19),0px 14px 20px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.1)',
    '0px 8px 18px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.15),0px 6px 28px 5px rgba(0,0,0,0.11)',
    '0px 9px 19px -5px rgba(0,0,0,0.21),0px 16px 24px 2px rgba(0,0,0,0.16),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 10px 20px -5px rgba(0,0,0,0.22),0px 16px 25px 3px rgba(0,0,0,0.17),0px 7px 30px 5px rgba(0,0,0,0.13)',
    '0px 10px 21px -5px rgba(0,0,0,0.23),0px 17px 26px 3px rgba(0,0,0,0.18),0px 7px 32px 5px rgba(0,0,0,0.14)',
    '0px 10px 22px -6px rgba(0,0,0,0.24),0px 18px 27px 3px rgba(0,0,0,0.19),0px 7px 34px 6px rgba(0,0,0,0.15)',
    '0px 11px 23px -6px rgba(0,0,0,0.25),0px 19px 29px 3px rgba(0,0,0,0.2),0px 8px 36px 6px rgba(0,0,0,0.16)',
    '0px 11px 24px -6px rgba(0,0,0,0.26),0px 20px 30px 3px rgba(0,0,0,0.21),0px 8px 38px 7px rgba(0,0,0,0.17)',
    '0px 12px 25px -6px rgba(0,0,0,0.27),0px 21px 32px 4px rgba(0,0,0,0.22),0px 9px 40px 7px rgba(0,0,0,0.18)',
    '0px 12px 26px -7px rgba(0,0,0,0.28),0px 22px 34px 4px rgba(0,0,0,0.23),0px 9px 42px 7px rgba(0,0,0,0.19)',
    '0px 13px 27px -7px rgba(0,0,0,0.29),0px 23px 36px 4px rgba(0,0,0,0.24),0px 10px 44px 8px rgba(0,0,0,0.2)',
    '0px 13px 28px -7px rgba(0,0,0,0.3),0px 24px 38px 4px rgba(0,0,0,0.25),0px 10px 46px 8px rgba(0,0,0,0.21)',
  ],
});

export default theme;