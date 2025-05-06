import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip
} from '@mui/material';
import { CalendarEvent } from '../../types';
import calendarService from '../../services/calendarService';

// Configurar el localizador para español
moment.locale('es');
const localizer = momentLocalizer(moment);

// Mapeo de tipos de eventos a colores
const eventColors: Record<string, string> = {
  absence: '#f44336', // rojo
  meeting: '#2196f3', // azul
  holiday: '#4caf50', // verde
  training: '#ff9800', // naranja
  other: '#9c27b0', // morado
};

const EmployeeCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Obtener eventos para un rango de 3 meses (mes anterior, actual y siguiente)
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      
      const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
      const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
      
      // Obtener eventos del usuario
      const userEvents = await calendarService.getUserEvents(
        formattedStartDate,
        formattedEndDate
      );
      
      // Obtener días festivos
      const holidays = await calendarService.getHolidays(today.getFullYear());
      
      // Combinar todos los eventos
      setEvents([...userEvents, ...holidays]);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los eventos del calendario');
      setLoading(false);
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  // Personalizar la apariencia de los eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = eventColors[event.type] || '#757575';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Calendario
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 600, mt: 2 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              defaultView={Views.MONTH}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              messages={{
                today: 'Hoy',
                previous: 'Anterior',
                next: 'Siguiente',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                agenda: 'Agenda',
                date: 'Fecha',
                time: 'Hora',
                event: 'Evento',
                noEventsInRange: 'No hay eventos en este rango',
                showMore: (total) => `+ Ver más (${total})`
              }}
            />
          </Box>
        )}

        {/* Diálogo de detalles del evento */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          {selectedEvent && (
            <>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)} 
                    sx={{ 
                      bgcolor: eventColors[selectedEvent.type] || '#757575',
                      color: 'white'
                    }}
                  />
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Fecha inicio:</strong> {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Fecha fin:</strong> {moment(selectedEvent.end).format('DD/MM/YYYY HH:mm')}
                </Typography>
                
                {selectedEvent.description && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Descripción:</strong> {selectedEvent.description}
                  </Typography>
                )}
                
                {selectedEvent.location && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Ubicación:</strong> {selectedEvent.location}
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cerrar</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmployeeCalendar;