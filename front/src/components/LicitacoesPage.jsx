// src/components/LicitacoesPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Event as CalendarIcon,
  LocationOn as MapPinIcon,
  Schedule as ClockIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as EyeIcon,
  Description as FileTextIcon,
  Error as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  Bolt as ZapIcon
} from '@mui/icons-material';

const LicitacoesPage = () => {
  const [licitacoes, setLicitacoes] = useState([]);
  const [filtros, setFiltros] = useState({
    busca: '',
    modalidade: '',
    status: '',
    interessesMarcados: false
  });
  const [carregando, setCarregando] = useState(true);
  const [interessesSelecionados, setInteressesSelecionados] = useState(new Set());

  // Dados mockados para demonstração
  const licitacoesMock = [
    {
      id: '1',
      numero: 'EDITAL DE PREGÃO ELETRÔNICO Nº 231/2025 – CSC',
      titulo: 'CONTRATAÇÃO, PELO MENOR PREÇO POR GLOBAL, DE PESSOA JURÍDICA ESPECIALIZADA NA PRESTAÇÃO DE SERVIÇO DE APOIO ADMINISTRATIVO, TÉCNICO E ESPECIALIZADO',
      orgao: 'Conselho Superior da Justiça',
      modalidade: 'Pregão Presencial',
      valor_estimado: 'R$ 2.450.000,00',
      data_abertura: '2025-07-15T10:00:00',
      data_limite: '2025-07-10T17:00:00',
      status: 'Aberta',
      categoria: 'Serviços',
      cidade: 'Brasília/DF',
      dias_restantes: 12,
      portal_origem: 'ComprasNet',
      tem_interesse: false,
      editais_analisados: 0,
      total_editais: 3
    },
    {
      id: '2',
      numero: 'POSTMAN-002/2025',
      titulo: 'Licitação Teste com Postman para desenvolvimento',
      orgao: 'Prefeitura Municipal',
      modalidade: 'Pregão Eletrônico',
      valor_estimado: 'R$ 180.000,00',
      data_abertura: '2025-06-25T14:00:00',
      data_limite: '2025-06-20T16:00:00',
      status: 'Aberta',
      categoria: 'Materiais',
      cidade: 'São Paulo/SP',
      dias_restantes: 7,
      portal_origem: 'BEC',
      tem_interesse: true,
      editais_analisados: 2,
      total_editais: 2
    },
    {
      id: '3',
      numero: 'Nº 001/2025',
      titulo: 'Aquisição de equipamentos de informática e licenças de software',
      orgao: 'Secretaria de Tecnologia',
      modalidade: 'Pregão Presencial',
      valor_estimado: 'R$ 850.000,00',
      data_abertura: '2025-07-20T09:00:00',
      data_limite: '2025-07-15T18:00:00',
      status: 'Aberta',
      categoria: 'TI',
      cidade: 'Rio de Janeiro/RJ',
      dias_restantes: 22,
      portal_origem: 'ComprasNet',
      tem_interesse: false,
      editais_analisados: 0,
      total_editais: 1
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setLicitacoes(licitacoesMock);
      setCarregando(false);
      
      // Carregar interesses salvos
      const interessesSalvos = licitacoesMock
        .filter(lic => lic.tem_interesse)
        .map(lic => lic.id);
      setInteressesSelecionados(new Set(interessesSalvos));
    }, 1000);
  }, []);

  const toggleInteresse = (id) => {
    const novosInteresses = new Set(interessesSelecionados);
    if (novosInteresses.has(id)) {
      novosInteresses.delete(id);
    } else {
      novosInteresses.add(id);
    }
    setInteressesSelecionados(novosInteresses);
    
    // Atualizar no backend
    console.log(`Interesse ${novosInteresses.has(id) ? 'marcado' : 'desmarcado'} para licitação ${id}`);
  };

  const analisarEditais = (licitacao) => {
    console.log('Analisar editais da licitação:', licitacao.numero);
    // Navegar para página de análise
  };

  const visualizarDetalhes = (licitacao) => {
    console.log('Visualizar detalhes da licitação:', licitacao.numero);
    // Abrir modal ou navegar para detalhes
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'aberta': return 'success';
      case 'em andamento': return 'primary';
      case 'fechada': return 'default';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'aberta': return <CheckCircleIcon />;
      case 'em andamento': return <ClockIcon />;
      case 'fechada': return <AlertCircleIcon />;
      default: return <ClockIcon />;
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarValor = (valor) => {
    return valor || 'Valor não informado';
  };

  const licitacoesFiltradas = licitacoes.filter(licitacao => {
    const matchBusca = licitacao.numero.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      licitacao.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      licitacao.orgao.toLowerCase().includes(filtros.busca.toLowerCase());
    
    const matchModalidade = !filtros.modalidade || licitacao.modalidade === filtros.modalidade;
    const matchStatus = !filtros.status || licitacao.status === filtros.status;
    const matchInteresse = !filtros.interessesMarcados || interessesSelecionados.has(licitacao.id);
    
    return matchBusca && matchModalidade && matchStatus && matchInteresse;
  });

  if (carregando) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0a0e27', p: 3 }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>
              Carregando licitações...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0e27', p: 3 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <ZapIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
              Licitações Disponíveis
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ color: 'grey.400' }}>
            Licitações obtidas automaticamente via API dos principais portais de licitação
          </Typography>
        </Box>

        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#1B263B' }}>
          <Grid container spacing={3}>
            {/* Busca */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar licitações..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'grey.400' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Modalidade */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Modalidade</InputLabel>
                <Select
                  value={filtros.modalidade}
                  label="Modalidade"
                  onChange={(e) => setFiltros({...filtros, modalidade: e.target.value})}
                >
                  <MenuItem value="">Todas as modalidades</MenuItem>
                  <MenuItem value="Pregão Eletrônico">Pregão Eletrônico</MenuItem>
                  <MenuItem value="Pregão Presencial">Pregão Presencial</MenuItem>
                  <MenuItem value="Concorrência">Concorrência</MenuItem>
                  <MenuItem value="Tomada de Preços">Tomada de Preços</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtros.status}
                  label="Status"
                  onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                >
                  <MenuItem value="">Todos os status</MenuItem>
                  <MenuItem value="Aberta">Aberta</MenuItem>
                  <MenuItem value="Em andamento">Em andamento</MenuItem>
                  <MenuItem value="Fechada">Fechada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Filtro de interesse */}
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filtros.interessesMarcados}
                    onChange={(e) => setFiltros({...filtros, interessesMarcados: e.target.checked})}
                  />
                }
                label="Apenas com interesse"
                sx={{ color: 'white' }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Estatísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#1B263B' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="grey.400">
                      Total
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {licitacoes.length}
                    </Typography>
                  </Box>
                  <FileTextIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#1B263B' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="grey.400">
                      Com Interesse
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      {interessesSelecionados.size}
                    </Typography>
                  </Box>
                  <StarIcon sx={{ fontSize: 32, color: 'success.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#1B263B' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="grey.400">
                      Abertas
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                      {licitacoes.filter(l => l.status === 'Aberta').length}
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#1B263B' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="grey.400">
                      Próximas 7 dias
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                      {licitacoes.filter(l => l.dias_restantes <= 7).length}
                    </Typography>
                  </Box>
                  <AlertCircleIcon sx={{ fontSize: 32, color: 'error.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de Licitações */}
        <Box sx={{ space: 3 }}>
          {licitacoesFiltradas.map((licitacao) => (
            <Paper
              key={licitacao.id}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: '#1B263B',
                borderLeft: interessesSelecionados.has(licitacao.id) ? '4px solid' : '4px solid',
                borderLeftColor: interessesSelecionados.has(licitacao.id) ? 'success.main' : 'grey.600',
                '&:hover': {
                  bgcolor: '#2c3e50'
                }
              }}
            >
              {/* Header da licitação */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {licitacao.numero}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(licitacao.status)}
                      label={licitacao.status}
                      color={getStatusColor(licitacao.status)}
                      size="small"
                    />
                    {licitacao.dias_restantes <= 7 && (
                      <Chip
                        icon={<AlertCircleIcon />}
                        label="Urgente"
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ color: 'grey.300', mb: 2, lineHeight: 1.6 }}>
                    {licitacao.titulo}
                  </Typography>
                </Box>
                
                {/* Ações principais */}
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <IconButton
                    onClick={() => toggleInteresse(licitacao.id)}
                    sx={{
                      color: interessesSelecionados.has(licitacao.id) ? 'success.main' : 'grey.400',
                      '&:hover': {
                        bgcolor: interessesSelecionados.has(licitacao.id) ? 'success.dark' : 'grey.700'
                      }
                    }}
                  >
                    {interessesSelecionados.has(licitacao.id) ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                  
                  <Button
                    onClick={() => analisarEditais(licitacao)}
                    variant="contained"
                    startIcon={<FileTextIcon />}
                    size="small"
                  >
                    Analisar ({licitacao.editais_analisados}/{licitacao.total_editais})
                  </Button>
                  
                  <Button
                    onClick={() => visualizarDetalhes(licitacao)}
                    variant="outlined"
                    startIcon={<EyeIcon />}
                    size="small"
                  >
                    Detalhes
                  </Button>
                </Box>
              </Box>

              {/* Informações detalhadas */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPinIcon sx={{ fontSize: 16, color: 'grey.400' }} />
                    <Typography variant="body2" color="grey.400">
                      <strong>Órgão:</strong> {licitacao.orgao}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterIcon sx={{ fontSize: 16, color: 'grey.400' }} />
                    <Typography variant="body2" color="grey.400">
                      <strong>Modalidade:</strong> {licitacao.modalidade}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: 'grey.400' }} />
                    <Typography variant="body2" color="grey.400">
                      <strong>Abertura:</strong> {formatarData(licitacao.data_abertura)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClockIcon sx={{ fontSize: 16, color: 'grey.400' }} />
                    <Typography variant="body2" color="grey.400">
                      <strong>Prazo:</strong>
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: licitacao.dias_restantes <= 7 ? 'error.main' : 
                               licitacao.dias_restantes <= 15 ? 'warning.main' : 'success.main'
                      }}
                    >
                      {licitacao.dias_restantes} dias
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Informações adicionais */}
              <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'grey.700' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="grey.400">
                      <strong>Valor Estimado:</strong>
                      <Typography component="span" sx={{ color: 'success.main', ml: 1, fontWeight: 'bold' }}>
                        {formatarValor(licitacao.valor_estimado)}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="grey.400">
                      <strong>Categoria:</strong>
                      <Typography component="span" sx={{ color: 'primary.main', ml: 1 }}>
                        {licitacao.categoria}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="grey.400">
                      <strong>Portal:</strong>
                      <Typography component="span" sx={{ color: 'secondary.main', ml: 1 }}>
                        {licitacao.portal_origem}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Mensagem quando não há resultados */}
        {licitacoesFiltradas.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AlertCircleIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'grey.400', mb: 1 }}>
              Nenhuma licitação encontrada
            </Typography>
            <Typography variant="body1" color="grey.500">
              Ajuste os filtros para encontrar licitações ou aguarde a próxima sincronização com os portais.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LicitacoesPage;