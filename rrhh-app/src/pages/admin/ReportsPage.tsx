import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  Description as ReportIcon,
  AccessTime as TimeIcon,
  BeachAccess as VacationIcon,
  People as PeopleIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { AbsenceType } from '../../types';
import timeTrackingService from '../../services/timeTrackingService';
import absenceService from '../../services/absenceService';

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros para informes
  const [startDate, setStartDate] = useState<Date | null>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | null>(endOfMonth(new Date()));
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedAbsenceType, setSelectedAbsenceType] = useState<string>('all');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf');

  // Generar informe de jornada laboral
  const handleGenerateTimeReport = async () => {
    if (!startDate || !endDate) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const userId = selectedEmployee !== 'all' ? selectedEmployee : undefined;
      
      const blob = await timeTrackingService.generateReport(
        formattedStartDate,
        formattedEndDate,
        userId
      );
      
      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe_jornada_${formattedStartDate}_${formattedEndDate}.${reportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess('Informe generado correctamente');
      setLoading(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      setError('Error al generar el informe');
      setLoading(false);
    }
  };

  // Generar informe de ausencias
  const handleGenerateAbsenceReport = async () => {
    if (!startDate || !endDate) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const userId = selectedEmployee !== 'all' ? selectedEmployee : undefined;
      const absenceType = selectedAbsenceType !== 'all' ? selectedAbsenceType as AbsenceType : undefined;
      
      const blob = await absenceService.generateReport(
        formattedStartDate,
        formattedEndDate,
        absenceType,
        userId
      );
      
      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe_ausencias_${formattedStartDate}_${formattedEndDate}.${reportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess('Informe generado correctamente');
      setLoading(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      setError('Error al generar el informe');
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Informes y Reportes
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filtros de Informes
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <DatePicker
                label="Fecha de Inicio"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <DatePicker
                label="Fecha de Fin"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="department-label">Departamento</InputLabel>
                <Select
                  labelId="department-label"
                  id="department"
                  value={selectedDepartment}
                  label="Departamento"
                  onChange={(e) => setSelectedDepartment(e.target.value as string)}
                >
                  <MenuItem value="all">Todos los departamentos</MenuItem>
                  <MenuItem value="desarrollo">Desarrollo</MenuItem>
                  <MenuItem value="rrhh">Recursos Humanos</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="finanzas">Finanzas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="employee-label">Empleado</InputLabel>
                <Select
                  labelId="employee-label"
                  id="employee"
                  value={selectedEmployee}
                  label="Empleado"
                  onChange={(e) => setSelectedEmployee(e.target.value as string)}
                >
                  <MenuItem value="all">Todos los empleados</MenuItem>
                  <MenuItem value="1">Juan Pérez</MenuItem>
                  <MenuItem value="2">María García</MenuItem>
                  <MenuItem value="3">Carlos Rodríguez</MenuItem>
                  <MenuItem value="4">Ana Martínez</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl>
                <Typography variant="subtitle2" gutterBottom>
                  Formato de Informe
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant={reportFormat === 'pdf' ? 'contained' : 'outlined'}
                      startIcon={<PdfIcon />}
                      onClick={() => setReportFormat('pdf')}
                    >
                      PDF
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant={reportFormat === 'excel' ? 'contained' : 'outlined'}
                      startIcon={<ExcelIcon />}
                      onClick={() => setReportFormat('excel')}
                    >
                      Excel
                    </Button>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Informe de Jornada Laboral */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Informe de Jornada Laboral
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Genera un informe detallado de los registros de jornada laboral, incluyendo horas trabajadas,
                  entradas, salidas y totales por empleado o departamento.
                </Typography>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="time-report-type-label">Tipo de Informe</InputLabel>
                  <Select
                    labelId="time-report-type-label"
                    id="time-report-type"
                    value="detailed"
                    label="Tipo de Informe"
                  >
                    <MenuItem value="detailed">Informe Detallado</MenuItem>
                    <MenuItem value="summary">Informe Resumido</MenuItem>
                    <MenuItem value="anomalies">Anomalías de Registro</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleGenerateTimeReport}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generar Informe'}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Informe de Ausencias */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VacationIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Informe de Ausencias
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Genera un informe de ausencias y vacaciones, incluyendo días solicitados,
                  aprobados y rechazados, agrupados por tipo y departamento.
                </Typography>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="absence-type-label">Tipo de Ausencia</InputLabel>
                  <Select
                    labelId="absence-type-label"
                    id="absence-type"
                    value={selectedAbsenceType}
                    label="Tipo de Ausencia"
                    onChange={(e) => setSelectedAbsenceType(e.target.value as string)}
                  >
                    <MenuItem value="all">Todos los tipos</MenuItem>
                    <MenuItem value={AbsenceType.VACATION}>Vacaciones</MenuItem>
                    <MenuItem value={AbsenceType.SICK_LEAVE}>Baja por Enfermedad</MenuItem>
                    <MenuItem value={AbsenceType.PERSONAL_LEAVE}>Asuntos Propios</MenuItem>
                    <MenuItem value={AbsenceType.MATERNITY_LEAVE}>Baja por Maternidad</MenuItem>
                    <MenuItem value={AbsenceType.PATERNITY_LEAVE}>Baja por Paternidad</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleGenerateAbsenceReport}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generar Informe'}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Informe de Personal */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Informe de Personal
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Genera un informe con datos de la plantilla, incluyendo distribución por departamentos,
                  antigüedad, y estadísticas generales de la empresa.
                </Typography>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="personnel-report-type-label">Tipo de Informe</InputLabel>
                  <Select
                    labelId="personnel-report-type-label"
                    id="personnel-report-type"
                    value="general"
                    label="Tipo de Informe"
                  >
                    <MenuItem value="general">Informe General</MenuItem>
                    <MenuItem value="departments">Por Departamentos</MenuItem>
                    <MenuItem value="seniority">Por Antigüedad</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generar Informe'}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Informes Personalizados */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReportIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Informes Personalizados
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Crea informes personalizados combinando diferentes métricas y dimensiones
                  según tus necesidades específicas.
                </Typography>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  La funcionalidad de informes personalizados estará disponible próximamente.
                </Alert>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={true}
                >
                  Próximamente
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Informes Recientes
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <TimeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Informe de Jornada Laboral - Mayo 2023" 
                secondary={`Generado el ${format(new Date(), 'dd/MM/yyyy')}`} 
              />
              <IconButton edge="end" aria-label="download">
                <DownloadIcon />
              </IconButton>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <VacationIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Informe de Ausencias - Q1 2023" 
                secondary={`Generado el ${format(addMonths(new Date(), -1), 'dd/MM/yyyy')}`} 
              />
              <IconButton edge="end" aria-label="download">
                <DownloadIcon />
              </IconButton>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Informe de Personal - Abril 2023" 
                secondary={`Generado el ${format(addMonths(new Date(), -1), 'dd/MM/yyyy')}`} 
              />
              <IconButton edge="end" aria-label="download">
                <DownloadIcon />
              </IconButton>
            </ListItem>
          </List>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportsPage;