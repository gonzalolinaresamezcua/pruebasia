import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import AbsenceRequestForm from '../../components/absences/AbsenceRequestForm';
import { AbsenceRequest, AbsenceType, RequestStatus } from '../../types';
import absenceService from '../../services/absenceService';

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

const AbsencesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState<AbsenceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openNewRequestDialog, setOpenNewRequestDialog] = useState(false);
  const [vacationBalance, setVacationBalance] = useState<{
    total: number;
    used: number;
    pending: number;
    remaining: number;
  } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AbsenceRequest | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchVacationBalance();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await absenceService.getUserRequests();
      setRequests(data);
      
      setLoading(false);
    } catch (error) {
      setError('Error al cargar las solicitudes de ausencia');
      setLoading(false);
    }
  };

  const fetchVacationBalance = async () => {
    try {
      const balance = await absenceService.getVacationBalance();
      setVacationBalance(balance);
    } catch (error) {
      console.error('Error al cargar el balance de vacaciones', error);
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

  const handleOpenNewRequestDialog = () => {
    setOpenNewRequestDialog(true);
  };

  const handleCloseNewRequestDialog = () => {
    setOpenNewRequestDialog(false);
    // Recargar las solicitudes después de crear una nueva
    fetchRequests();
    fetchVacationBalance();
  };

  const handleViewRequestDetail = (request: AbsenceRequest) => {
    setSelectedRequest(request);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedRequest(null);
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      setLoading(true);
      await absenceService.cancelRequest(requestId);
      fetchRequests();
      fetchVacationBalance();
      handleCloseDetailDialog();
      setLoading(false);
    } catch (error) {
      setError('Error al cancelar la solicitud');
      setLoading(false);
    }
  };

  // Filtrar solicitudes según la pestaña seleccionada
  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return true; // Todas
    if (tabValue === 1) return request.status === RequestStatus.PENDING;
    if (tabValue === 2) return request.status === RequestStatus.APPROVED;
    if (tabValue === 3) return request.status === RequestStatus.REJECTED;
    return true;
  });

  // Traducir tipo de ausencia
  const getAbsenceTypeText = (type: AbsenceType): string => {
    const types: Record<AbsenceType, string> = {
      [AbsenceType.VACATION]: 'Vacaciones',
      [AbsenceType.SICK_LEAVE]: 'Baja por Enfermedad',
      [AbsenceType.PERSONAL_LEAVE]: 'Asuntos Propios',
      [AbsenceType.MATERNITY_LEAVE]: 'Baja por Maternidad',
      [AbsenceType.PATERNITY_LEAVE]: 'Baja por Paternidad',
      [AbsenceType.OTHER]: 'Otro',
    };
    return types[type] || type;
  };

  // Obtener color y texto según el estado
  const getStatusChip = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <Chip label="Pendiente" color="warning" size="small" />;
      case RequestStatus.APPROVED:
        return <Chip label="Aprobada" color="success" size="small" />;
      case RequestStatus.REJECTED:
        return <Chip label="Rechazada" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Vacaciones y Ausencias
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewRequestDialog}
        >
          Nueva Solicitud
        </Button>
      </Box>

      {/* Balance de vacaciones */}
      {vacationBalance && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Días Totales
              </Typography>
              <Typography variant="h4" color="primary">
                {vacationBalance.total}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Días Usados
              </Typography>
              <Typography variant="h4">
                {vacationBalance.used}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Días Pendientes
              </Typography>
              <Typography variant="h4" color="warning.main">
                {vacationBalance.pending}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Días Disponibles
              </Typography>
              <Typography variant="h4" color="success.main">
                {vacationBalance.remaining}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="absence request tabs">
          <Tab label="Todas" />
          <Tab label="Pendientes" />
          <Tab label="Aprobadas" />
          <Tab label="Rechazadas" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderRequestsTable()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderRequestsTable()}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderRequestsTable()}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderRequestsTable()}
      </TabPanel>

      {/* Diálogo para nueva solicitud */}
      <Dialog
        open={openNewRequestDialog}
        onClose={handleCloseNewRequestDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <AbsenceRequestForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewRequestDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de detalles de solicitud */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              Detalles de la Solicitud
              <Box sx={{ mt: 1 }}>
                {getStatusChip(selectedRequest.status)}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Tipo de Ausencia
                  </Typography>
                  <Typography variant="body1">
                    {getAbsenceTypeText(selectedRequest.type)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Fecha de Inicio
                  </Typography>
                  <Typography variant="body1">
                    {format(parseISO(selectedRequest.startDate), 'dd/MM/yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Fecha de Fin
                  </Typography>
                  <Typography variant="body1">
                    {format(parseISO(selectedRequest.endDate), 'dd/MM/yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Motivo
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.reason}
                  </Typography>
                </Grid>
                {selectedRequest.comments && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Comentarios
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.comments}
                    </Typography>
                  </Grid>
                )}
                {selectedRequest.approvedBy && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Aprobado/Rechazado por
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.approvedBy}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedRequest.status === RequestStatus.PENDING && (
                <Button 
                  onClick={() => handleCancelRequest(selectedRequest.id)} 
                  color="error"
                >
                  Cancelar Solicitud
                </Button>
              )}
              <Button onClick={handleCloseDetailDialog}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );

  function renderRequestsTable() {
    return (
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredRequests.length > 0 ? (
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Fecha Inicio</TableCell>
                    <TableCell>Fecha Fin</TableCell>
                    <TableCell>Duración</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha Solicitud</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((request) => (
                      <TableRow 
                        key={request.id}
                        hover
                        onClick={() => handleViewRequestDetail(request)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{getAbsenceTypeText(request.type)}</TableCell>
                        <TableCell>{format(parseISO(request.startDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(parseISO(request.endDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          {Math.floor((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} días
                        </TableCell>
                        <TableCell>{getStatusChip(request.status)}</TableCell>
                        <TableCell>{format(new Date(request.id.substring(0, 8)), 'dd/MM/yyyy', { locale: es })}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRequests.length}
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
        ) : (
          <Alert severity="info">
            No hay solicitudes {tabValue === 0 ? '' : tabValue === 1 ? 'pendientes' : tabValue === 2 ? 'aprobadas' : 'rechazadas'} para mostrar.
          </Alert>
        )}
      </Box>
    );
  }
};

export default AbsencesPage;