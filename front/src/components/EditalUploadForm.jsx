// src/components/EditalUploadForm.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import ResultadoAnaliseModal from './ResultadoAnaliseModal';

const EditalUploadForm = ({ licitacaoId, onUploadSuccess }) => {
  const [arquivo, setArquivo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSucesso, setUploadSucesso] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para o modal de resultado
  const [editalId, setEditalId] = useState(null);
  const [modalResultadoAberto, setModalResultadoAberto] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setArquivo(file);
    setError(null);
    setUploadSucesso(false);
  };

  const handleUpload = async () => {
    if (!arquivo || !licitacaoId) {
      setError('Por favor, selecione um arquivo PDF');
      return;
    }

    // Validar se é PDF
    if (!arquivo.name.toLowerCase().endsWith('.pdf')) {
      setError('Apenas arquivos PDF são aceitos');
      return;
    }

    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/api/v1/licitacoes/${licitacaoId}/upload_edital/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const dados = await response.json();
        
        // Salvar o ID do edital criado
        setEditalId(dados.id);
        setUploadSucesso(true);
        
        // Chamar a função de callback para o componente pai
        if (onUploadSuccess) {
          onUploadSuccess({
            success: true,
            message: `Edital '${arquivo.name}' recebido e enviado para análise!`,
            editalId: dados.id
          });
        }
        
        console.log('Upload realizado com sucesso:', dados);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro no upload');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError(error.message);
      
      // Notificar erro ao componente pai
      if (onUploadSuccess) {
        onUploadSuccess({
          error: true,
          message: `Erro no upload: ${error.message}`
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const abrirResultado = () => {
    setModalResultadoAberto(true);
  };

  const resetForm = () => {
    setArquivo(null);
    setUploadSucesso(false);
    setError(null);
    setEditalId(null);
    // Limpar o input de arquivo
    const fileInput = document.getElementById('arquivo-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Box>
      {/* Input de Arquivo */}
      <Box sx={{ mb: 2 }}>
        <input
          id="arquivo-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="arquivo-input">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ 
              py: 1.5,
              borderStyle: 'dashed',
              borderWidth: 2,
              textTransform: 'none'
            }}
          >
            {arquivo ? arquivo.name : 'Selecionar Arquivo PDF'}
          </Button>
        </label>
        
        {arquivo && (
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'grey.400' }}>
            Arquivo selecionado: {arquivo.name} ({(arquivo.size / 1024 / 1024).toFixed(2)} MB)
          </Typography>
        )}
      </Box>

      {/* Botão de Upload */}
      <Button
        onClick={handleUpload}
        disabled={uploading || !arquivo}
        variant="contained"
        fullWidth
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        sx={{ mb: 2 }}
      >
        {uploading ? 'Enviando e Analisando...' : 'Enviar e Iniciar Análise'}
      </Button>

      {/* Área de Erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Área de Sucesso com Botão para Ver Resultado */}
      {uploadSucesso && editalId && (
        <Paper 
          sx={{ 
            p: 2, 
            bgcolor: 'success.dark', 
            border: '1px solid',
            borderColor: 'success.main'
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6" color="success.light">
              Upload e Análise Concluídos!
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2, color: 'success.50' }}>
            O edital foi enviado e processado com sucesso. A análise inteligente foi realizada.
          </Typography>
          
          <Divider sx={{ my: 1, borderColor: 'success.main' }} />
          
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              onClick={abrirResultado}
              variant="contained"
              color="primary"
              startIcon={<AssessmentIcon />}
              size="small"
            >
              Ver Resultado da Análise
            </Button>
            
            <Button
              onClick={resetForm}
              variant="outlined"
              color="inherit"
              size="small"
            >
              Enviar Outro Edital
            </Button>
          </Box>
        </Paper>
      )}

      {/* Modal de Resultado */}
      <ResultadoAnaliseModal
        editalId={editalId}
        open={modalResultadoAberto}
        onClose={() => setModalResultadoAberto(false)}
      />
    </Box>
  );
};

export default EditalUploadForm;