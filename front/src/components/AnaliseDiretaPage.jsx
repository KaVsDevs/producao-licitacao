// src/components/AnaliseDiretaPage.jsx

import React, { useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Este é um sub-componente para exibir os resultados da análise de forma organizada.
// Ele fica no mesmo arquivo para simplificar.
const AnaliseResultDisplay = ({ edital }) => {
    // Se não há um edital analisado, não mostra nada.
    if (!edital) {
        return null;
    }
    
    // Mostra mensagens de status durante e após a análise.
    if (edital.status_analise === 'processando') {
        return <Alert severity="info">Análise em andamento...</Alert>;
    }
    if (edital.status_analise === 'erro') {
        return <Alert severity="error">Houve um erro na análise deste edital.</Alert>;
    }
    if (!edital.sumario_analise) {
        return <Alert severity="warning">Análise concluída, mas sem sumário para exibir.</Alert>;
    }

    // Se a análise foi um sucesso, exibe o sumário.
    return (
        <Paper sx={{ p: 3, mt: 4, bgcolor: '#1B263B' }}>
            <Typography variant="h5" gutterBottom>Resultado da Análise</Typography>
            <Typography component="div" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: '#E0E1DD', maxHeight: '60vh', overflowY: 'auto', p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
                {edital.sumario_analise}
            </Typography>
        </Paper>
    );
};


// Este é o componente principal da página.
function AnaliseDiretaPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [analiseResult, setAnaliseResult] = useState(null); // Para guardar o objeto Edital retornado pela API

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError('');
    setAnaliseResult(null); // Limpa o resultado anterior ao selecionar um novo arquivo
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo PDF.');
      return;
    }

    setIsUploading(true);
    setError('');
    setAnaliseResult(null);

    const formData = new FormData();
    formData.append('arquivo', selectedFile);

    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/editais/analise-direta/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAnaliseResult(data); // Guarda o objeto Edital completo retornado pela API
      } else {
        setError(data.detail || 'Ocorreu um erro no servidor durante a análise.');
      }
    } catch (err) {
      setError('Erro de rede. Não foi possível conectar ao servidor.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
        Análise Rápida de Edital
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#A9A9A9', mb: 4 }}>
        Envie um arquivo PDF de qualquer edital para receber uma análise instantânea e salvá-la no seu histórico.
      </Typography>

      <Paper sx={{ p: 3, bgcolor: '#1B263B' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>Enviar Arquivo para Análise</Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<CloudUploadIcon />}
            sx={{ p: 3, mt: 2, color: '#E0E1DD', borderColor: '#415A77', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' } }}
          >
            {selectedFile ? `Arquivo Selecionado: ${selectedFile.name}` : 'Clique aqui para selecionar o arquivo PDF'}
            <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
          </Button>

          {selectedFile && (
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isUploading}
              sx={{ py: 1.5, mt: 2, fontSize: '1rem' }}
            >
              {isUploading ? <CircularProgress size={26} color="inherit" /> : 'Analisar Agora'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Área para exibir erros ou o resultado da análise */}
      {error && <Alert severity="error" sx={{mt: 3}}>{error}</Alert>}
      
      {/* O componente de resultado só é renderizado se houver um resultado */}
      <AnaliseResultDisplay edital={analiseResult} />

    </Box>
  );
}

export default AnaliseDiretaPage;