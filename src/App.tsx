import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, ThemeProvider, createTheme, IconButton } from '@mui/material';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import { TrendingUp, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#2196F3',
        light: '#4dabf5',
        dark: '#1769aa',
      },
      secondary: {
        main: '#FFD700',
        light: '#ffdf33',
        dark: '#b29600',
      },
      background: {
        paper: mode === 'dark' ? '#1E1E1E' : '#ffffff',
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      success: {
        main: '#4caf50',
      },
      info: {
        main: '#29b6f6',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'dark' ? '#555' : '#999',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'dark' ? '#777' : '#777',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatProvider>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <TrendingUp size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Trading AI Assistant
              </Typography>
              <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Toolbar>
          </AppBar>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Toolbar />
            <ChatView />
          </Box>
        </Box>
      </ChatProvider>
    </ThemeProvider>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  );
};

export default AppWrapper;