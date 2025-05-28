import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';

import { TrendingUp } from 'lucide-react';

const App: React.FC = () => {

  return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <TrendingUp size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                AI Assistant
              </Typography>
            </Toolbar>
          </AppBar>
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
          </Box>
        </Box>
  );
};

const AppWrapper: React.FC = () => {
  return (
      <App />
  );
};

export default AppWrapper;