// src/components/ResultadoAnaliseModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const ResultadoAnaliseModal = ({ editalId, open, onClose }) => {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && editalId) {
      buscarResultado();
    }
  }, [open, editalId]);

  const buscarResultado = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken'); // Usando o mesmo nome que você usa
      const response = await fetch(`http://127.0.0.1:8000/api/v1/editais/${editalId}/resultado_analise/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResultado(data);
      } else {
        throw new Error('Erro ao buscar resultado da análise');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analisado':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'processando':
        return <ScheduleIcon sx={{ color: 'warning.main' }} />;
      case 'erro':
      case 'erro_analise_ia':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <ScheduleIcon sx={{ color: 'grey.500' }} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'analisado':
        return 'Análise Concluída';
      case 'processando':
        return 'Processando...';
      case 'erro':
        return 'Erro na Análise';
      case 'erro_analise_ia':
        return 'Erro na IA';
      default:
        return 'Pendente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'analisado':
        return 'success';
      case 'processando':
        return 'warning';
      case 'erro':
      case 'erro_analise_ia':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatarTextoAnalise = (texto) => {
    if (!texto) return '';
    
    return texto
      .replace(/# (.*)/g, '<h2 style="font-size: 1.5rem; font-weight: bold; color: #1976d2; margin: 1rem 0;">$1</h2>')
      .replace(/## (.*)/g, '<h3 style="font-size: 1.25rem; font-weight: 600; color: #42a5f5; margin: 0.75rem 0;">$1</h3>')
      .replace(/### (.*)/g, '<h4 style="font-size: 1.1rem; font-weight: 500; color: #64b5f6; margin: 0.5rem 0;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')
      .replace(/- (.*)/g, '<div style="margin-left: 1rem; margin-bottom: 0.25rem;">• $1</div>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1B263B',
          color: 'white',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <DescriptionIcon />
            <Typography variant="h6">Resultado da Análise</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Carregando resultado...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {resultado && (
          <Box>
            {/* Informações do Edital */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: '#0D1B2A' }}>
              <Typography variant="h6" gutterBottom color="primary">
                📄 Informações do Edital
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <DescriptionIcon fontSize="small" />
                    <Typography variant="body2" color="grey.400">Nome:</Typography>
                    <Typography variant="body2" fontWeight="500">
                      {resultado.nome}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getStatusIcon(resultado.status_analise)}
                    <Typography variant="body2" color="grey.400">Status:</Typography>
                    <Chip 
                      label={getStatusText(resultado.status_analise)}
                      color={getStatusColor(resultado.status_analise)}
                      size="small"
                    />
                  </Box>
                </Grid>

                {resultado.data_analise && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <CalendarIcon fontSize="small" />
                      <Typography variant="body2" color="grey.400">Data da Análise:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {new Date(resultado.data_analise).toLocaleString('pt-BR')}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {resultado.licitacao && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <BusinessIcon fontSize="small" />
                      <Typography variant="body2" color="grey.400">Licitação:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {resultado.licitacao.numero}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Resultado da Análise */}
            {resultado.sumario_analise && (
              <Paper sx={{ p: 2, bgcolor: '#0D1B2A' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  🤖 Análise Detalhada
                </Typography>
                <Divider sx={{ mb: 2, borderColor: 'grey.700' }} />
                
                <Box
                  sx={{
                    maxHeight: '400px',
                    overflow: 'auto',
                    p: 2,
                    bgcolor: '#041426',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.700'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatarTextoAnalise(resultado.sumario_analise)
                  }}
                />
              </Paper>
            )}

            {/* Erro na análise */}
            {(resultado.status_analise === 'erro' || resultado.status_analise === 'erro_analise_ia') && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Erro na Análise
                </Typography>
                <Typography>
                  Ocorreu um erro durante o processamento da análise. Tente fazer o upload novamente.
                </Typography>
                {resultado.sumario_analise && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: 'error.dark', borderRadius: 1 }}>
                    <Typography variant="body2">
                      {resultado.sumario_analise}
                    </Typography>
                  </Box>
                )}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {resultado?.arquivo_info?.url && (
          <Button
            startIcon={<DownloadIcon />}
            component="a"
            href={resultado.arquivo_info.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
          >
            Baixar PDF
          </Button>
        )}
        <Button onClick={onClose} variant="outlined">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultadoAnaliseModal;