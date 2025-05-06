import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import TimeTracker from '../../components/timeTracking/TimeTracker';
import { TimeRecord } from '../../types';
import timeTrackingService from '../../services/timeTrackingService';

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

const TimeTrackingPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalHours, setTotalHours] = useState(0);

  // Obtener el primer y último día del mes actual
  const firstDayOfMonth = startOfMonth(new Date());
  const lastDayOfMonth = endOfMonth(new Date());

  useEffect(() => {
    if (tabValue === 1) {
      fetchTimeRecords();
    }
  }, [tabValue]);

  const fetchTimeRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = format(firstDayOfMonth, 'yyyy-MM-dd');
      const endDate = format(lastDayOfMonth, 'yyyy-MM-dd');
      
      const data = await timeTrackingService.getUserTimeRecords(startDate, endDate);
      setRecords(data);
      
      // Calcular el total de horas trabajadas
      const total = data.reduce((sum, record) => sum + (record.totalHours || 0), 0);
      setTotalHours(total);
      
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los registros de jornada');
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Registro de Jornada Laboral
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="time tracking tabs">
          <Tab label="Registro Diario" />
          <Tab label="Historial Mensual" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TimeTracker />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom>
          Historial del mes: {format(new Date(), 'MMMM yyyy', { locale: es })}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Horas Trabajadas
              </Typography>
              <Typography variant="h4" color="primary">
                {totalHours.toFixed(2)}h
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Días Trabajados
              </Typography>
              <Typography variant="h4" color="primary">
                {records.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Promedio Diario
              </Typography>
              <Typography variant="h4" color="primary">
                {records.length > 0 ? (totalHours / records.length).toFixed(2) : '0.00'}h
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Día</TableCell>
                    <TableCell>Entrada</TableCell>
                    <TableCell>Salida</TableCell>
                    <TableCell>Horas</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.length > 0 ? (
                    records
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {format(parseISO(record.date), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            {format(parseISO(record.date), 'EEEE', { locale: es })}
                          </TableCell>
                          <TableCell>
                            {record.checkIn ? format(parseISO(record.checkIn), 'HH:mm:ss') : '-'}
                          </TableCell>
                          <TableCell>
                            {record.checkOut ? format(parseISO(record.checkOut), 'HH:mm:ss') : '-'}
                          </TableCell>
                          <TableCell>{record.totalHours?.toFixed(2) || '-'}</TableCell>
                          <TableCell>
                            {record.status === 'complete' ? (
                              <Typography variant="body2" color="success.main">
                                Completado
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="warning.main">
                                Incompleto
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay registros para este mes
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </Paper>
        )}
      </TabPanel>
    </Box>
  );
};

export default TimeTrackingPage;