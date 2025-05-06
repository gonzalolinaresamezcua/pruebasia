import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { esES } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

// Componentes de layout
import MainLayout from './components/layout/MainLayout';

// Páginas de autenticación
import LoginPage from './pages/auth/LoginPage';

// Páginas principales
import DashboardPage from './pages/dashboard/DashboardPage';
import TimeTrackingPage from './pages/timeTracking/TimeTrackingPage';
import AbsencesPage from './pages/absences/AbsencesPage';
import CalendarPage from './pages/calendar/CalendarPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import ProfilePage from './pages/profile/ProfilePage';

// Páginas de administración
import UsersPage from './pages/admin/UsersPage';
import SettingsPage from './pages/admin/SettingsPage';
import ReportsPage from './pages/admin/ReportsPage';

// Redux
import { RootState } from './store';
import { getCurrentUser } from './store/slices/authSlice';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
}, esES);

// Componente para rutas protegidas
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar si el usuario tiene el rol requerido
  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="time-tracking" element={<TimeTrackingPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="absences" element={<AbsencesPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              
              {/* Rutas de administración */}
              <Route path="users" element={
                <ProtectedRoute requiredRole={['admin', 'hr_manager']}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute requiredRole={['admin', 'hr_manager']}>
                  <ReportsPage />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;