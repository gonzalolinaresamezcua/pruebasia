import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Container } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';
import { RootState } from '../../store';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirigir al dashboard si el usuario ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(to right, #2193b0, #6dd5ed)',
      }}
    >
      <Container maxWidth="sm">
        <LoginForm />
      </Container>
    </Box>
  );
};

export default LoginPage;