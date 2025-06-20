import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Videocam as CameraIcon } from '@mui/icons-material';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
            }}
          >
            Camera Analytics Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              href="/"
              sx={{ textTransform: 'none' }}
            >
              Cameras
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 