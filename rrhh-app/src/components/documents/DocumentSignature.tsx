import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { Document } from '../../types';
import documentService from '../../services/documentService';

interface DocumentSignatureProps {
  document: Document;
  onSignComplete: () => void;
}

const DocumentSignature: React.FC<DocumentSignatureProps> = ({ document, onSignComplete }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSign = async () => {
    if (!signatureRef.current) return;
    
    if (signatureRef.current.isEmpty()) {
      setError('Por favor, dibuja tu firma antes de continuar');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Obtener la firma como imagen en base64
      const signatureData = signatureRef.current.toDataURL('image/png');
      
      // Enviar la firma al servidor
      await documentService.signDocument(document.id, signatureData);
      
      setLoading(false);
      handleClose();
      onSignComplete();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al firmar el documento');
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Firmar Documento
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Firma del Documento: {document.title}
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Por favor, dibuja tu firma en el espacio a continuación:
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ mt: 2, mb: 3 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 1,
                backgroundColor: '#f9f9f9'
              }}
            >
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 600,
                  height: 200,
                  className: 'signature-canvas'
                }}
                backgroundColor="rgba(255, 255, 255, 0)"
              />
            </Paper>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary">
            Al firmar este documento, confirmo que he leído y acepto su contenido.
            Esta firma electrónica tiene la misma validez legal que una firma manuscrita.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClear} color="inherit">
            Borrar
          </Button>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSign} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            Confirmar Firma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentSignature;