import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  Event as CalendarIcon,
  BeachAccess as VacationIcon,
  Description as DocumentIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RootState } from '../../store';
import { UserRole, AbsenceRequest, Document, TimeRecord, Notification } from '../../types';
import timeTrackingService from '../../services/timeTrackingService';
import absenceService from '../../services/absenceService';
import documentService from '../../services/documentService';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTimeRecord, setCurrentTimeRecord] = useState<TimeRecord | null>(null);
  const [pendingAbsences, setPendingAbsences] = useState<AbsenceRequest[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [vacationBalance, setVacationBalance] = useState<{
    total: number;
    used: number;
    pending: number;
    remaining: number;
  } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener registro de jornada actual
        const timeRecord = await timeTrackingService.getCurrentTimeRecord();
        setCurrentTimeRecord(timeRecord);
        
        // Obtener solicitudes de ausencia pendientes
        const userRequests = await absenceService.getUserRequests();
        setPendingAbsences(userRequests.filter(req => req.status === 'pending'));
        
        // Obtener documentos pendientes de firma
        const documents = await documentService.getDocumentsRequiringSignature();
        setPendingDocuments(documents);
        
        // Obtener balance de vacaciones
        const balance = await absenceService.getVacationBalance();
        setVacationBalance(balance);
        
        // Aquí se obtendría las notificaciones (simulado por ahora)
        setNotifications([
          {
            id: '1',
            userId: user?.id || '',
            title: 'Documento pendiente de firma',
            message: 'Tienes un documento pendiente de firma',
            date: new Date().toISOString(),
            read: false,
            type: 'info',
            link: '/documents'
          },
          {
            id: '2',
            userId: user?.id || '',
            title: 'Solicitud de vacaciones aprobada',
            message: 'Tu solicitud de vacaciones ha sido aprobada',
            date: new Date().toISOString(),
            read: false,
            type: 'success',
            link: '/absences'
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.firstName}
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Estado de la jornada */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ClockIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Estado de Jornada</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {currentTimeRecord ? (
                currentTimeRecord.checkIn && !currentTimeRecord.checkOut ? (
                  <>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Jornada en curso
                    </Alert>
                    <Typography variant="body1">
                      Entrada: {format(new Date(currentTimeRecord.checkIn), 'HH:mm')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        component={Link} 
                        to="/time-tracking"
                      >
                        Ir a Registro de Jornada
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Jornada completada
                    </Alert>
                    <Typography variant="body1">
                      Entrada: {format(new Date(currentTimeRecord.checkIn), 'HH:mm')}
                    </Typography>
                    <Typography variant="body1">
                      Salida: {format(new Date(currentTimeRecord.checkOut!), 'HH:mm')}
                    </Typography>
                    <Typography variant="body1">
                      Horas: {currentTimeRecord.totalHours.toFixed(2)}h
                    </Typography>
                  </>
                )
              ) : (
                <>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    No has iniciado tu jornada
                  </Alert>
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      component={Link} 
                      to="/time-tracking"
                    >
                      Iniciar Jornada
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Balance de vacaciones */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VacationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Balance de Vacaciones</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {vacationBalance ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Días Totales
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {vacationBalance.total}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Días Disponibles
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {vacationBalance.remaining}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Días Usados
                      </Typography>
                      <Typography variant="h4">
                        {vacationBalance.used}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Días Pendientes
                      </Typography>
                      <Typography variant="h4">
                        {vacationBalance.pending}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Typography>No se pudo cargar el balance de vacaciones</Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={Link} 
                  to="/absences"
                >
                  Solicitar Vacaciones
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Solicitudes pendientes */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Solicitudes Pendientes</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {pendingAbsences.length > 0 ? (
                <List>
                  {pendingAbsences.slice(0, 3).map((absence) => (
                    <ListItem key={absence.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <VacationIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${absence.type === 'vacation' ? 'Vacaciones' : 'Ausencia'}`}
                        secondary={`${format(new Date(absence.startDate), 'dd/MM/yyyy')} - ${format(new Date(absence.endDate), 'dd/MM/yyyy')}`}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Pendiente
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No tienes solicitudes pendientes</Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={Link} 
                  to="/absences"
                >
                  Ver Todas
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Documentos pendientes */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DocumentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Documentos Pendientes</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {pendingDocuments.length > 0 ? (
                <List>
                  {pendingDocuments.slice(0, 3).map((document) => (
                    <ListItem key={document.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <DocumentIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={document.title}
                        secondary={`Subido el ${format(new Date(document.uploadedAt), 'dd/MM/yyyy')}`}
                      />
                      <Typography variant="caption" color="error">
                        Firma Pendiente
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No tienes documentos pendientes de firma</Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={Link} 
                  to="/documents"
                >
                  Ver Todos
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sección adicional para administradores y RRHH */}
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.HR_MANAGER) && (
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Panel de Administración</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      component={Link} 
                      to="/users"
                      sx={{ py: 2 }}
                    >
                      Gestión de Usuarios
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      component={Link} 
                      to="/reports"
                      sx={{ py: 2 }}
                    >
                      Informes y Reportes
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      component={Link} 
                      to="/settings"
                      sx={{ py: 2 }}
                    >
                      Configuración
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardPage;