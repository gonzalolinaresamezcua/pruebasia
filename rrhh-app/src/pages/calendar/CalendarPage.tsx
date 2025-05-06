import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Add as AddIcon } from '@mui/icons-material';
import EmployeeCalendar from '../../components/calendar/EmployeeCalendar';
import { CalendarEvent } from '../../types';
import calendarService from '../../services/calendarService';

// Esquema de validación para eventos
const EventSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título es obligatorio')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  start: Yup.date()
    .required('La fecha de inicio es obligatoria'),
  end: Yup.date()
    .required('La fecha de fin es obligatoria')
    .min(
      Yup.ref('start'),
      'La fecha de fin debe ser posterior a la fecha de inicio'
    ),
  type: Yup.string()
    .required('El tipo de evento es obligatorio'),
  description: Yup.string()
    .max(500, 'La descripción no puede exceder los 500 caracteres'),
  location: Yup.string()
    .max(200, 'La ubicación no puede exceder los 200 caracteres'),
  allDay: Yup.boolean(),
});

const CalendarPage: React.FC = () => {
  const [openNewEventDialog, setOpenNewEventDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenNewEventDialog = () => {
    setOpenNewEventDialog(true);
  };

  const handleCloseNewEventDialog = () => {
    setOpenNewEventDialog(false);
  };

  const handleCreateEvent = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      
      await calendarService.createEvent({
        title: values.title,
        start: values.start,
        end: values.end,
        type: values.type,
        description: values.description,
        location: values.location,
        allDay: values.allDay,
      });
      
      setSuccess('Evento creado correctamente');
      setLoading(false);
      handleCloseNewEventDialog();
      
      // Forzar actualización del calendario
      setRefreshKey(prev => prev + 1);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      setError('Error al crear el evento');
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Calendario
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenNewEventDialog}
          >
            Nuevo Evento
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Visualiza y gestiona todos tus eventos, reuniones, ausencias y días festivos en un solo lugar.
            Utiliza el calendario para planificar tu tiempo de manera eficiente.
          </Typography>
        </Paper>

        <Box sx={{ mt: 3 }}>
          <EmployeeCalendar key={refreshKey} />
        </Box>

        {/* Diálogo para crear nuevo evento */}
        <Dialog
          open={openNewEventDialog}
          onClose={handleCloseNewEventDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Crear Nuevo Evento</DialogTitle>
          <Formik
            initialValues={{
              title: '',
              start: new Date(),
              end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hora después
              type: 'meeting',
              description: '',
              location: '',
              allDay: false,
            }}
            validationSchema={EventSchema}
            onSubmit={handleCreateEvent}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        id="title"
                        name="title"
                        label="Título del Evento"
                        error={touched.title && Boolean(errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <DateTimePicker
                        label="Fecha y Hora de Inicio"
                        value={values.start}
                        onChange={(date) => setFieldValue('start', date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: touched.start && Boolean(errors.start),
                            helperText: touched.start && errors.start as string,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <DateTimePicker
                        label="Fecha y Hora de Fin"
                        value={values.end}
                        onChange={(date) => setFieldValue('end', date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: touched.end && Boolean(errors.end),
                            helperText: touched.end && errors.end as string,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl 
                        fullWidth 
                        error={touched.type && Boolean(errors.type)}
                      >
                        <InputLabel id="event-type-label">Tipo de Evento</InputLabel>
                        <Field
                          as={Select}
                          labelId="event-type-label"
                          id="type"
                          name="type"
                          label="Tipo de Evento"
                        >
                          <MenuItem value="meeting">Reunión</MenuItem>
                          <MenuItem value="training">Formación</MenuItem>
                          <MenuItem value="other">Otro</MenuItem>
                        </Field>
                        {touched.type && errors.type && (
                          <FormHelperText>{errors.type as string}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        id="location"
                        name="location"
                        label="Ubicación"
                        error={touched.location && Boolean(errors.location)}
                        helperText={touched.location && errors.location}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        id="description"
                        name="description"
                        label="Descripción"
                        multiline
                        rows={4}
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseNewEventDialog}>Cancelar</Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Crear Evento'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarPage;