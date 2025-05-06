import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format, differenceInCalendarDays, addDays } from 'date-fns';
import { AbsenceType } from '../../types';
import absenceService from '../../services/absenceService';

// Esquema de validación
const AbsenceRequestSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(Object.values(AbsenceType), 'Tipo de ausencia inválido')
    .required('El tipo de ausencia es obligatorio'),
  startDate: Yup.date()
    .required('La fecha de inicio es obligatoria')
    .min(new Date(), 'La fecha de inicio debe ser posterior a hoy'),
  endDate: Yup.date()
    .required('La fecha de fin es obligatoria')
    .min(
      Yup.ref('startDate'),
      'La fecha de fin debe ser posterior a la fecha de inicio'
    ),
  reason: Yup.string()
    .required('El motivo es obligatorio')
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede exceder los 500 caracteres'),
});

interface AbsenceRequestFormValues {
  type: AbsenceType;
  startDate: Date | null;
  endDate: Date | null;
  reason: string;
}

const AbsenceRequestForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const initialValues: AbsenceRequestFormValues = {
    type: AbsenceType.VACATION,
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
    reason: '',
  };

  const handleSubmit = async (values: AbsenceRequestFormValues) => {
    if (!values.startDate || !values.endDate) return;

    try {
      setLoading(true);
      setError(null);
      
      await absenceService.createRequest({
        type: values.type,
        startDate: format(values.startDate, 'yyyy-MM-dd'),
        endDate: format(values.endDate, 'yyyy-MM-dd'),
        reason: values.reason,
      });
      
      setSuccess('Solicitud enviada correctamente');
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al enviar la solicitud');
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Nueva Solicitud de Ausencia
          </Typography>
          
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

          <Formik
            initialValues={initialValues}
            validationSchema={AbsenceRequestSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, handleChange }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      id="type"
                      name="type"
                      label="Tipo de Ausencia"
                      value={values.type}
                      onChange={handleChange}
                      error={touched.type && Boolean(errors.type)}
                      helperText={touched.type && errors.type}
                    >
                      <MenuItem value={AbsenceType.VACATION}>Vacaciones</MenuItem>
                      <MenuItem value={AbsenceType.SICK_LEAVE}>Baja por Enfermedad</MenuItem>
                      <MenuItem value={AbsenceType.PERSONAL_LEAVE}>Asuntos Propios</MenuItem>
                      <MenuItem value={AbsenceType.MATERNITY_LEAVE}>Baja por Maternidad</MenuItem>
                      <MenuItem value={AbsenceType.PATERNITY_LEAVE}>Baja por Paternidad</MenuItem>
                      <MenuItem value={AbsenceType.OTHER}>Otro</MenuItem>
                    </Field>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Fecha de Inicio"
                      value={values.startDate}
                      onChange={(date) => setFieldValue('startDate', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.startDate && Boolean(errors.startDate),
                          helperText: touched.startDate && errors.startDate as string,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Fecha de Fin"
                      value={values.endDate}
                      onChange={(date) => setFieldValue('endDate', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.endDate && Boolean(errors.endDate),
                          helperText: touched.endDate && errors.endDate as string,
                        },
                      }}
                    />
                  </Grid>

                  {values.startDate && values.endDate && (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        Duración: {differenceInCalendarDays(values.endDate, values.startDate) + 1} día(s)
                      </Alert>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="reason"
                      name="reason"
                      label="Motivo"
                      multiline
                      rows={4}
                      value={values.reason}
                      onChange={handleChange}
                      error={touched.reason && Boolean(errors.reason)}
                      helperText={touched.reason && errors.reason}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Enviar Solicitud'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default AbsenceRequestForm;