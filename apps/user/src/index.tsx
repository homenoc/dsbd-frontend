import React from 'react';
import './index.css';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { createRoot } from 'react-dom/client';
import App from './App';
import { queryClient } from './lib/queryClient';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={5000}
        action={(snackbarId) => (
          <IconButton onClick={() => closeSnackbar(snackbarId)}>
            <CloseIcon />
          </IconButton>
        )}
      >
        <App />
      </SnackbarProvider>
    </QueryClientProvider>,
  );
}
