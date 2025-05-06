import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Add as AddIcon,
  Description as DocumentIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  CheckCircle as SignedIcon,
  PendingActions as PendingIcon
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DocumentSignature from '../../components/documents/DocumentSignature';
import { Document } from '../../types';
import documentService from '../../services/documentService';

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

// Esquema de validación para subir documentos
const DocumentSchema = Yup.object().shape({
  title: Yup.string()
    .required('El título es obligatorio')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  description: Yup.string()
    .max(500, 'La descripción no puede exceder los 500 caracteres'),
  file: Yup.mixed()
    .required('El archivo es obligatorio'),
  requiresSignature: Yup.boolean(),
});

const DocumentsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
    fetchPendingDocuments();
  }, [refreshKey]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await documentService.getAllDocuments();
      setDocuments(response.documents);
      
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los documentos');
      setLoading(false);
    }
  };

  const fetchPendingDocuments = async () => {
    try {
      const pendingDocs = await documentService.getDocumentsRequiringSignature();
      setPendingDocuments(pendingDocs);
    } catch (error) {
      console.error('Error al cargar documentos pendientes', error);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setFileToUpload(null);
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedDocument(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const file = event.currentTarget.files[0];
      setFileToUpload(file);
      setFieldValue('file', file);
    }
  };

  const handleUploadDocument = async (values: any) => {
    if (!fileToUpload) return;

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('title', values.title);
      formData.append('description', values.description || '');
      formData.append('requiresSignature', values.requiresSignature ? 'true' : 'false');
      
      await documentService.uploadDocument(formData);
      
      setSuccess('Documento subido correctamente');
      setLoading(false);
      handleCloseUploadDialog();
      
      // Forzar actualización de la lista de documentos
      setRefreshKey(prev => prev + 1);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      setError('Error al subir el documento');
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentId: string) => {
    try {
      setLoading(true);
      
      const blob = await documentService.downloadDocument(documentId);
      
      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedDocument?.title || 'documento';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setLoading(false);
    } catch (error) {
      setError('Error al descargar el documento');
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      setLoading(true);
      
      await documentService.deleteDocument(documentId);
      
      setSuccess('Documento eliminado correctamente');
      handleCloseDetailDialog();
      
      // Forzar actualización de la lista de documentos
      setRefreshKey(prev => prev + 1);
      
      setLoading(false);
    } catch (error) {
      setError('Error al eliminar el documento');
      setLoading(false);
    }
  };

  const handleSignComplete = () => {
    // Forzar actualización de la lista de documentos
    setRefreshKey(prev => prev + 1);
    handleCloseDetailDialog();
    setSuccess('Documento firmado correctamente');
  };

  // Filtrar documentos según la pestaña seleccionada
  const filteredDocuments = tabValue === 0 ? documents : pendingDocuments;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Documentos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenUploadDialog}
        >
          Subir Documento
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="document tabs">
          <Tab label="Todos los Documentos" />
          <Tab label="Pendientes de Firma" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderDocumentsList()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderDocumentsList()}
      </TabPanel>

      {/* Diálogo para subir documento */}
      <Dialog
        open={openUploadDialog}
        onClose={handleCloseUploadDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Subir Nuevo Documento</DialogTitle>
        <Formik
          initialValues={{
            title: '',
            description: '',
            file: null,
            requiresSignature: false,
          }}
          validationSchema={DocumentSchema}
          onSubmit={handleUploadDocument}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="title"
                      name="title"
                      label="Título del Documento"
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
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

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      {fileToUpload ? fileToUpload.name : 'Seleccionar Archivo'}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                      />
                    </Button>
                    {touched.file && errors.file && (
                      <Typography color="error" variant="caption">
                        {errors.file as string}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Field
                          as={Checkbox}
                          id="requiresSignature"
                          name="requiresSignature"
                        />
                      }
                      label="Requiere firma"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseUploadDialog}>Cancelar</Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Subir Documento'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Diálogo de detalles del documento */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedDocument && (
          <>
            <DialogTitle>
              {selectedDocument.title}
              {selectedDocument.requiresSignature && (
                <Chip 
                  label={selectedDocument.signatures.length > 0 ? "Firmado" : "Pendiente de Firma"} 
                  color={selectedDocument.signatures.length > 0 ? "success" : "warning"}
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle1" gutterBottom>
                Descripción
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedDocument.description || 'Sin descripción'}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Subido por
                  </Typography>
                  <Typography variant="body2">
                    {selectedDocument.uploadedBy}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de subida
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(selectedDocument.uploadedAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </Typography>
                </Grid>
              </Grid>
              
              {selectedDocument.requiresSignature && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Firmas
                  </Typography>
                  
                  {selectedDocument.signatures.length > 0 ? (
                    <List>
                      {selectedDocument.signatures.map((signature) => (
                        <ListItem key={signature.id}>
                          <ListItemIcon>
                            <SignedIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={signature.userId}
                            secondary={`Firmado el ${format(new Date(signature.signatureDate), 'dd/MM/yyyy HH:mm', { locale: es })}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Este documento aún no ha sido firmado.
                    </Typography>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => handleDownloadDocument(selectedDocument.id)}
                disabled={loading}
              >
                Descargar
              </Button>
              
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => handleDeleteDocument(selectedDocument.id)}
                disabled={loading}
              >
                Eliminar
              </Button>
              
              {selectedDocument.requiresSignature && 
               selectedDocument.signatures.length === 0 && (
                <DocumentSignature 
                  document={selectedDocument} 
                  onSignComplete={handleSignComplete} 
                />
              )}
              
              <Button onClick={handleCloseDetailDialog}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );

  function renderDocumentsList() {
    return (
      <Box sx={{ mt: 3 }}>
        {loading && tabValue === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredDocuments.length > 0 ? (
          <Grid container spacing={3}>
            {filteredDocuments.map((document) => (
              <Grid item xs={12} sm={6} md={4} key={document.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                  onClick={() => handleViewDocument(document)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DocumentIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" noWrap>
                        {document.title}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2
                      }}
                    >
                      {document.description || 'Sin descripción'}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary" display="block">
                      Subido el {format(new Date(document.uploadedAt), 'dd/MM/yyyy', { locale: es })}
                    </Typography>
                    
                    {document.requiresSignature && (
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          icon={document.signatures.length > 0 ? <SignedIcon /> : <PendingIcon />}
                          label={document.signatures.length > 0 ? "Firmado" : "Pendiente de Firma"} 
                          color={document.signatures.length > 0 ? "success" : "warning"}
                          size="small"
                        />
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<DownloadIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadDocument(document.id);
                      }}
                    >
                      Descargar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            {tabValue === 0 
              ? 'No hay documentos disponibles.' 
              : 'No hay documentos pendientes de firma.'}
          </Alert>
        )}
      </Box>
    );
  }
};

export default DocumentsPage;