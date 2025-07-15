// src/components/PaginaNovaAnalise.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import EditalUploadForm from './EditalUploadForm';
import AnaliseInteligenteUpload from './AnaliseInteligenteUpload';

// Componente para exibir o resultado da análise (mantido como estava)
const AnaliseResultDisplay = ({ resultado }) => {
    if (!resultado) {
        return <Typography color="text.secondary">Aguardando envio do arquivo...</Typography>;
    }
    
    if (resultado.error) {
        return <Alert severity="error" sx={{width: '100%'}}>{resultado.message}</Alert>;
    }

    return <Alert severity="success" sx={{width: '100%'}}>{resultado.message}</Alert>;
};

function PaginaNovaAnalise() {
  // Estados existentes
  const [licitacoes, setLicitacoes] = useState([]);
  const [selectedLicitacaoId, setSelectedLicitacaoId] = useState('');
  const [loadingLicitacoes, setLoadingLicitacoes] = useState(true);
  const [uploadResult, setUploadResult] = useState(null);
  
  // Novo estado para controlar as abas
  const [tipoAnalise, setTipoAnalise] = useState(0); // 0 = Análise Direta, 1 = Com Licitação

  const fetchLicitacoes = useCallback(async () => {
    setLoadingLicitacoes(true);
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/licitacoes/', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
            const data = await response.json();
            setLicitacoes(data.results || []);
        } else {
            console.error("Falha ao buscar licitações para a página de análise.");
        }
    } catch (error) {
        console.error("Erro de rede ao buscar licitações", error);
    } finally {
        setLoadingLicitacoes(false);
    }
  }, []);

  useEffect(() => {
    fetchLicitacoes();
  }, [fetchLicitacoes]);

  const handleLicitacaoChange = (event) => {
    setSelectedLicitacaoId(event.target.value);
    setUploadResult(null); 
  };
  
  const handleUploadComplete = (resultado) => {
    setUploadResult(resultado);
  };

  const handleTabChange = (event, newValue) => {
    setTipoAnalise(newValue);
    setUploadResult(null);
    setSelectedLicitacaoId('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
        Nova Análise de Edital
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#A9A9A9', mb: 4 }}>
        Escolha como deseja analisar seu edital: análise rápida e direta ou vinculada a uma licitação.
      </Typography>

      {/* Abas para escolher tipo de análise */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tipoAnalise} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#A9A9A9',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            },
            '& .Mui-selected': {
              color: '#3b82f6 !important'
            }
          }}
        >
          <Tab 
            icon={<PsychologyIcon />} 
            label="Análise Inteligente Direta" 
            iconPosition="start"
            sx={{ gap: 1 }}
          />
          <Tab 
            icon={<BusinessIcon />} 
            label="Análise com Licitação" 
            iconPosition="start"
            sx={{ gap: 1 }}
          />
        </Tabs>
      </Box>

      {/* Conteúdo baseado na aba selecionada */}
      {tipoAnalise === 0 && (
        // Análise Direta (Nova funcionalidade)
        <Box>
          <Card sx={{ mb: 3, bgcolor: '#1B263B', border: '1px solid #3b82f6' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <PsychologyIcon color="primary" />
                <Typography variant="h6" color="primary">
                  Análise Inteligente Direta
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                🚀 <strong>Mais rápido:</strong> Envie qualquer edital e receba análise imediata<br/>
                🎯 <strong>Mais simples:</strong> Não precisa cadastrar licitação<br/>
                🤖 <strong>IA completa:</strong> Extração de documentos, certidões e declarações
              </Typography>
            </CardContent>
          </Card>
          
          <AnaliseInteligenteUpload />
        </Box>
      )}

      {tipoAnalise === 1 && (
        // Análise com Licitação (Funcionalidade original)
        <Box>
          <Card sx={{ mb: 3, bgcolor: '#1B263B', border: '1px solid #6b7280' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <BusinessIcon color="primary" />
                <Typography variant="h6" color="primary">
                  Análise Vinculada à Licitação
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                📊 <strong>Organizado:</strong> Análise fica vinculada à licitação específica<br/>
                📋 <strong>Controle:</strong> Acompanhe histórico de editais por licitação<br/>
                🗂️ <strong>Gestão:</strong> Ideal para processos formais e documentação
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, bgcolor: '#1B263B', height: '100%' }}>
                <Typography variant="h6" gutterBottom>1. Selecione a Licitação</Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="select-licitacao-label">Licitação de Destino</InputLabel>
                  <Select
                    labelId="select-licitacao-label"
                    value={selectedLicitacaoId}
                    label="Licitação de Destino"
                    onChange={handleLicitacaoChange}
                    disabled={loadingLicitacoes}
                  >
                    <MenuItem value="">
                      <em>{loadingLicitacoes ? "Carregando..." : "-- Selecione uma Licitação --"}</em>
                    </MenuItem>
                    {licitacoes.map((lic) => (
                      <MenuItem key={lic.id} value={lic.id}>
                        {`${lic.numero_licitacao || 'S/N'} - ${lic.titulo_objeto.substring(0, 40)}...`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedLicitacaoId && (
                  <Box sx={{mt: 3}}>
                    <Typography variant="h6" gutterBottom>2. Envie o Edital</Typography>
                    <EditalUploadForm 
                      licitacaoId={selectedLicitacaoId}
                      onUploadSuccess={handleUploadComplete}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, bgcolor: '#1B263B', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>Status do Envio</Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <AnaliseResultDisplay resultado={uploadResult} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default PaginaNovaAnalise;