import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TimeRecord } from '../../types';
import timeTrackingService from '../../services/timeTrackingService';
import { RootState } from '../../store';

const TimeTracker: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentRecord, setCurrentRecord] = useState<TimeRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Cargar el registro actual al montar el componente
  useEffect(() => {
    const fetchCurrentRecord = async () => {
      try {
        setLoading(true);
        const record = await timeTrackingService.getCurrentTimeRecord();
        setCurrentRecord(record);
        
        // Si hay un registro activo, calcular el tiempo transcurrido
        if (record && record.checkIn && !record.checkOut) {
          const checkInTime = new Date(record.checkIn).getTime();
          const now = new Date().getTime();
          setElapsedTime(Math.floor((now - checkInTime) / 1000));
        }
        
        setLoading(false);
      } catch (error) {
        setError('Error al cargar el registro de jornada actual');
        setLoading(false);
      }
    };

    fetchCurrentRecord();
  }, []);

  // Actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Si hay un registro activo, actualizar el tiempo transcurrido
      if (currentRecord && currentRecord.checkIn && !currentRecord.checkOut) {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [currentRecord]);

  // Formatear el tiempo transcurrido
  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejar el inicio de jornada
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const record = await timeTrackingService.checkIn();
      setCurrentRecord(record);
      setElapsedTime(0);
      setSuccess('Jornada iniciada correctamente');
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (error) {
      setError('Error al iniciar la jornada');
      setLoading(false);
    }
  };

  // Manejar el fin de jornada
  const handleCheckOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const record = await timeTrackingService.checkOut();
      setCurrentRecord(record);
      setSuccess('Jornada finalizada correctamente');
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (error) {
      setError('Error al finalizar la jornada');
      setLoading(false);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ClockIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            Registro de Jornada
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Fecha Actual
              </Typography>
              <Typography variant="h4">
                {format(currentTime, 'dd MMMM yyyy', { locale: es })}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Hora Actual
              </Typography>
              <Typography variant="h4">
                {format(currentTime, 'HH:mm:ss')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Estado Actual
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : currentRecord && currentRecord.checkIn && !currentRecord.checkOut ? (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Jornada en curso
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Hora de entrada:</strong> {format(new Date(currentRecord.checkIn), 'HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Tiempo transcurrido:</strong> {formatElapsedTime(elapsedTime)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<StopIcon />}
                  onClick={handleCheckOut}
                  disabled={loading}
                >
                  Finalizar Jornada
                </Button>
              </Box>
            </>
          ) : currentRecord && currentRecord.checkIn && currentRecord.checkOut ? (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                Jornada finalizada
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Hora de entrada:</strong> {format(new Date(currentRecord.checkIn), 'HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Hora de salida:</strong> {format(new Date(currentRecord.checkOut), 'HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Horas trabajadas:</strong> {currentRecord.totalHours.toFixed(2)}h
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Ya has completado tu jornada de hoy
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                No has iniciado tu jornada
              </Alert>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<StartIcon />}
                  onClick={handleCheckIn}
                  disabled={loading}
                >
                  Iniciar Jornada
                </Button>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeTracker;