import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Configuración general
  const [companyName, setCompanyName] = useState('Mi Empresa S.L.');
  const [companyEmail, setCompanyEmail] = useState('info@miempresa.com');
  const [companyPhone, setCompanyPhone] = useState('+34 912 345 678');
  const [companyAddress, setCompanyAddress] = useState('Calle Gran Vía 123, 28013 Madrid');
  
  // Configuración de vacaciones
  const [vacationDaysPerYear, setVacationDaysPerYear] = useState(22);
  const [allowNegativeBalance, setAllowNegativeBalance] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [minDaysBeforeRequest, setMinDaysBeforeRequest] = useState(7);
  
  // Configuración de jornada laboral
  const [workdayHours, setWorkdayHours] = useState(8);
  const [workdayStartTime, setWorkdayStartTime] = useState('09:00');
  const [workdayEndTime, setWorkdayEndTime] = useState('17:00');
  const [allowFlexibleHours, setAllowFlexibleHours] = useState(true);
  const [trackBreaks, setTrackBreaks] = useState(true);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveGeneralSettings = () => {
    setLoading(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      setSuccess('Configuración general guardada correctamente');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };

  const handleSaveVacationSettings = () => {
    setLoading(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      setSuccess('Configuración de vacaciones guardada correctamente');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };

  const handleSaveWorkdaySettings = () => {
    setLoading(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      setSuccess('Configuración de jornada laboral guardada correctamente');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };

  const handleBackupData = () => {
    setLoading(true);
    
    // Simulación de backup
    setTimeout(() => {
      setLoading(false);
      setSuccess('Copia de seguridad creada correctamente');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1500);
  };

  const handleRestoreData = () => {
    setLoading(true);
    
    // Simulación de restauración
    setTimeout(() => {
      setLoading(false);
      setSuccess('Datos restaurados correctamente');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 2000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuración del Sistema
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

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChangeTab} aria-label="settings tabs">
            <Tab label="General" />
            <Tab label="Vacaciones" />
            <Tab label="Jornada Laboral" />
            <Tab label="Copias de Seguridad" />
          </Tabs>
        </Box>

        {/* Configuración General */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información de la Empresa
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la Empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email de Contacto"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Configuración de Notificaciones
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch checked={true} />}
                label="Notificaciones por Email"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch checked={true} />}
                label="Notificaciones en la Aplicación"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveGeneralSettings}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Configuración de Vacaciones */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Políticas de Vacaciones
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Días de Vacaciones por Año"
                value={vacationDaysPerYear}
                onChange={(e) => setVacationDaysPerYear(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 0, max: 365 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Días Mínimos de Antelación para Solicitudes"
                value={minDaysBeforeRequest}
                onChange={(e) => setMinDaysBeforeRequest(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 0, max: 90 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={requireApproval} 
                    onChange={(e) => setRequireApproval(e.target.checked)} 
                  />
                }
                label="Requerir Aprobación para Vacaciones"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={allowNegativeBalance} 
                    onChange={(e) => setAllowNegativeBalance(e.target.checked)} 
                  />
                }
                label="Permitir Balance Negativo de Vacaciones"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Tipos de Ausencias
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Vacaciones" 
                    secondary="Días de descanso remunerados" 
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={<Switch checked={true} />}
                      label="Activo"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Baja por Enfermedad" 
                    secondary="Ausencia por motivos de salud" 
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={<Switch checked={true} />}
                      label="Activo"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Asuntos Propios" 
                    secondary="Ausencia por motivos personales" 
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={<Switch checked={true} />}
                      label="Activo"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveVacationSettings}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Configuración de Jornada Laboral */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Horario Laboral
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Horas de Jornada Diaria"
                value={workdayHours}
                onChange={(e) => setWorkdayHours(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1, max: 24 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="time"
                label="Hora de Inicio"
                value={workdayStartTime}
                onChange={(e) => setWorkdayStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="time"
                label="Hora de Fin"
                value={workdayEndTime}
                onChange={(e) => setWorkdayEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={allowFlexibleHours} 
                    onChange={(e) => setAllowFlexibleHours(e.target.checked)} 
                  />
                }
                label="Permitir Horario Flexible"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={trackBreaks} 
                    onChange={(e) => setTrackBreaks(e.target.checked)} 
                  />
                }
                label="Registrar Pausas y Descansos"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Configuración de Registro de Jornada
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch checked={true} />}
                label="Registro Obligatorio"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch checked={true} />}
                label="Permitir Correcciones Manuales"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveWorkdaySettings}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Copias de Seguridad */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Gestión de Copias de Seguridad
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader title="Crear Copia de Seguridad" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Crea una copia de seguridad completa de todos los datos del sistema.
                    Esto incluye usuarios, registros de jornada, solicitudes de ausencia y documentos.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<BackupIcon />}
                    onClick={handleBackupData}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Crear Copia de Seguridad'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader title="Restaurar Datos" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Restaura el sistema a partir de una copia de seguridad anterior.
                    Esta acción reemplazará todos los datos actuales.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<RestoreIcon />}
                    onClick={handleRestoreData}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Restaurar Datos'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Copias de Seguridad Disponibles
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Copia de seguridad - 15/05/2023 10:30" 
                    secondary="Tamaño: 24.5 MB" 
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Copia de seguridad - 01/05/2023 09:15" 
                    secondary="Tamaño: 23.8 MB" 
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Copia de seguridad - 15/04/2023 14:45" 
                    secondary="Tamaño: 22.1 MB" 
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default SettingsPage;