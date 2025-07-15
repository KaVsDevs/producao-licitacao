import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Paper, Grid, CircularProgress, Alert,
    Button, List, Divider, CardActions, Chip
} from '@mui/material';

// Ícones
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import GetAppIcon from '@mui/icons-material/GetApp';
import ArticleIcon from '@mui/icons-material/Article';
import EditalUploadForm from './EditalUploadForm';


// ====================================================================================
//  COMPONENTES E LÓGICA
// ====================================================================================

const EditalCard = ({ edital, onSolicitarAnalise, onVerAnalise, actionLoading, isSelected }) => (
    <Paper variant="outlined" sx={{ mb: 2, backgroundColor: isSelected ? 'action.hover' : 'background.paper', transition: 'background-color 0.3s' }}>
        <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>{edital.descricao_breve || 'Documento'}</Typography>
        <Typography component="div" sx={{ mb: 1.5 }} color="text.secondary"> 
            Tipo: {edital.tipo_documento_display} | Status: 
            <Chip 
                 label={edital.status_analise_display || 'N/A'}
                 size="small"
                 color="success" 
            />
            </Typography>
        </Box>
        <CardActions>
            {(edital.status_analise === 'pendente' || edital.status_analise === 'erro') && (
                <Button size="small" variant="contained" startIcon={<PlayCircleOutlineIcon />} onClick={() => onSolicitarAnalise(edital.id)} disabled={actionLoading === edital.id}>{actionLoading === edital.id ? 'Processando...' : 'Analisar'}</Button>
            )}
            {(edital.status_analise === 'analisado' || edital.status_analise === 'analise_completa') && (
                <Button size="small" variant="outlined" startIcon={<FindInPageIcon />} onClick={() => onVerAnalise(edital)}>{isSelected ? 'Ocultar Análise' : 'Ver Análise'}</Button>
            )}
        </CardActions>
    </Paper>
);

const AnaliseDetalhada = ({ edital }) => {
    const renderSumario = (sumario) => {
        return sumario.split('\n').map((line, index) => {
            if (line.startsWith('# ')) return <Typography key={index} variant="h6" component="h3" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>{line.substring(2)}</Typography>;
            if (line.startsWith('## ')) return <Typography key={index} variant="subtitle1" component="h4" sx={{ mt: 1.5, mb: 0.5, fontWeight: 'bold' }}>{line.substring(3)}</Typography>;
            if (line.trim().startsWith('- ')) return <Box key={index} sx={{ display: 'flex', pl: 2, mb: 0.5 }}><Typography sx={{ mr: 1 }}>•</Typography><Typography variant="body2">{line.substring(2)}</Typography></Box>;
            return <Typography key={index} variant="body2" sx={{ my: 0.5 }}>{line}</Typography>;
        });
    };
    if (!edital || !edital.sumario_analise) return <Alert severity="warning">Os dados da análise não estão disponíveis.</Alert>;
    return (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 2, borderTop: '4px solid', borderColor: 'primary.main' }}>
            <Typography variant="h5" component="h2" gutterBottom><ArticleIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />Resumo da Análise (IA)</Typography>
            <Box sx={{ maxHeight: '600px', overflowY: 'auto', p: 1 }}>
                {renderSumario(edital.sumario_analise)}
            </Box>
        </Paper>
    );
};

function AnaliseEditaisLicitacao({ licitacaoId }) {
    const [editais, setEditais] = useState([]);
    const [licitacaoNome, setLicitacaoNome] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedEdital, setSelectedEdital] = useState(null);

    // Lógica de Fetch e Ações do Usuário (sem alterações)
    const fetchLicitacaoDetails = useCallback(async (token) => {
        if (!licitacaoId) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/licitacoes/${licitacaoId}/`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const data = await response.json();
                setLicitacaoNome(data.numero_licitacao || data.titulo_objeto);
            }
        } catch (e) { console.error("Erro ao buscar detalhes da licitação", e); }
    }, [licitacaoId]);

    const fetchEditais = useCallback(async (token) => {
        if (!licitacaoId) { setLoading(false); return; }
        setLoading(true); setError('');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/editais/?licitacao=${licitacaoId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const data = await response.json();
                setEditais(data.results || []);
            } else { setError(`Erro ao buscar editais: ${response.status}`); }
        } catch (e) { setError('Erro de rede ao buscar editais.'); }
        finally { setLoading(false); }
    }, [licitacaoId]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) { setError('Usuário não autenticado.'); setLoading(false); return; }
        if (licitacaoId) {
            fetchLicitacaoDetails(token);
            fetchEditais(token);
        } else { setError('Nenhuma licitação selecionada.'); setLoading(false); }
    }, [licitacaoId, fetchEditais, fetchLicitacaoDetails]);

    const handleSolicitarAnalise = async (editalId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        setActionLoading(editalId); setError('');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/editais/${editalId}/solicitar-analise/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) { fetchEditais(token); } 
            else {
                const data = await response.json();
                setError(`Erro ao solicitar análise: ${data.detail || response.statusText}`);
            }
        } catch (e) { setError('Erro de rede ao solicitar análise.'); }
        finally { setActionLoading(null); }
    };

    const handleVerAnalise = async (edital) => {
        if (selectedEdital?.id === edital.id) {
            setSelectedEdital(null); return;
        }
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/editais/${edital.id}/`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const data = await response.json();
                setSelectedEdital(data);
            } else {
                setError('Não foi possível carregar os detalhes da análise.');
                setSelectedEdital(null);
            }
        } catch (e) { setError('Erro de rede ao carregar a análise.'); }
        finally { setLoading(false); }
    };

    // ----- LÓGICA FINAL PARA EXPORTAÇÃO DE PDF -----
    const exportarParaPDF = () => {
        if (!selectedEdital) return;

        // Função para agrupar e limpar os documentos
        const obterDocumentosAgrupados = () => {
            const dados = selectedEdital?.documentos_requeridos_identificados;
            if (!dados) return {};

            const todosDocumentos = [];
            Object.keys(dados).forEach(chave => {
                if (Array.isArray(dados[chave])) {
                    todosDocumentos.push(...dados[chave].map(doc => ({
                        ...doc,
                        categoria_display: chave.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                    })));
                }
            });

            const agrupados = new Map();

            todosDocumentos.forEach(doc => {
                // CORREÇÃO FINAL: Lógica robusta para encontrar nome/texto
                const textoPrincipal = doc.texto_original || doc.texto_exigencia || doc.texto || '';
                let nome = doc.nome_documento || doc.nome;
                
                if (!nome && doc.categoria_display.toLowerCase().includes('declaracoes')) {
                    nome = textoPrincipal || 'Declaração sem texto';
                } else if (!nome) {
                    nome = 'Documento sem nome';
                }

                // Pula o documento se ele for uma declaração sem texto algum
                if (nome === 'Declaração sem texto') {
                    return;
                }
                
                let chaveAgrupamento = nome;
                if (doc.categoria_display.toLowerCase().includes('certidoes')) {
                    const nomeLower = nome.toLowerCase();
                    if (nomeLower.includes('fgts')) chaveAgrupamento = "Certificado de Regularidade do FGTS (CRF)";
                    else if (nomeLower.includes('inss') || nomeLower.includes('previdência')) chaveAgrupamento = "Certidão Negativa de Débitos (INSS)";
                    else if (nomeLower.includes('trabalhista') || nomeLower.includes('cndt')) chaveAgrupamento = "Certidão Negativa de Débitos Trabalhistas (CNDT)";
                    else if (nomeLower.includes('federal') || nomeLower.includes('união')) chaveAgrupamento = "Certidão Conjunta Negativa de Débitos Federais e Dívida Ativa";
                    else if (nomeLower.includes('estadual')) chaveAgrupamento = "Certidão Negativa de Débitos Estaduais";
                    else if (nomeLower.includes('municipal')) chaveAgrupamento = "Certidão Negativa de Débitos Municipais";
                }

                if (agrupados.has(chaveAgrupamento)) {
                    const existente = agrupados.get(chaveAgrupamento);
                    if (doc.referencia_item && !existente.referencias.includes(doc.referencia_item)) {
                        existente.referencias.push(doc.referencia_item);
                    }
                } else {
                    agrupados.set(chaveAgrupamento, {
                        nome: nome,
                        chave: chaveAgrupamento,
                        texto: textoPrincipal,
                        categoria: doc.categoria_display,
                        referencias: doc.referencia_item ? [doc.referencia_item] : [],
                    });
                }
            });
            
            const resultadoFinal = {};
            agrupados.forEach(doc => {
                if (!resultadoFinal[doc.categoria]) resultadoFinal[doc.categoria] = [];
                resultadoFinal[doc.categoria].push(doc);
            });
            return resultadoFinal;
        };
        
        const gerarHTMLDocumentos = () => {
            const documentosAgrupados = obterDocumentosAgrupados();
            if (Object.keys(documentosAgrupados).length === 0) return "<p>Nenhum documento detalhado encontrado.</p>";

            let html = '';
            for (const categoria in documentosAgrupados) {
                html += `<h3 style="border-bottom: 1px solid #ccc; padding-bottom: 8px; color: #2c3e50;">${categoria} (${documentosAgrupados[categoria].length})</h3>`;
                html += `<ul style="list-style-type: none; padding-left: 0;">`;
                documentosAgrupados[categoria].forEach(doc => {
                    // Decide se o título principal será a chave agrupada ou o nome original
                    let tituloPrincipal = doc.categoria.toLowerCase().includes('certidoes') ? doc.chave : doc.nome;
                    
                    html += `<li style="margin-bottom: 12px; padding: 8px; border-left: 3px solid #3498db;">
                                <strong>${tituloPrincipal}</strong>
                                <span style="font-size: 0.8em; color: #7f8c8d;"> (Itens: ${doc.referencias.join(', ') || 'N/A'})</span>
                                ${!doc.categoria.toLowerCase().includes('certidoes') ? `<p style="margin: 4px 0 0 0; color: #555;">${doc.texto}</p>` : ''}
                             </li>`;
                });
                html += `</ul>`;
            }
            return html;
        };
        
        const conteudo = `
            <html>
                <head><title>Relatório - ${selectedEdital.descricao_breve}</title></head>
                <body style="font-family: Arial, sans-serif; margin: 25px;">
                    <h1>Relatório de Análise do Edital</h1>
                    <h2>${licitacaoNome}</h2>
                    <p><strong>Documento Analisado:</strong> ${selectedEdital.descricao_breve}</p><hr>
                    ${gerarHTMLDocumentos()}
                </body>
            </html>
        `;
        const novaJanela = window.open('', '_blank');
        novaJanela.document.write(conteudo);
        novaJanela.document.close();
        setTimeout(() => novaJanela.print(), 500);
    };

    if (loading && !editais.length) return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    if (!licitacaoId) return <Container sx={{ mt: 4 }}><Alert severity="info">Selecione uma licitação para ver seus editais.</Alert></Container>;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>Análise de Editais: {licitacaoNome || `...`}</Typography>
            {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" component="h2" gutterBottom>Documentos Cadastrados ({editais.length})</Typography>
        {/* <<< 2. ADICIONE O FORMULÁRIO DE UPLOAD AQUI >>> */}
            <EditalUploadForm 
                licitacaoId={licitacaoId} 
                onUploadSuccess={() => {
                    console.log("Upload bem-sucedido! Recarregando a lista de editais...");
                    fetchEditais(); // <-- A MÁGICA ACONTECE AQUI!
                }} 
            />            
                    
                    
                    <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        {editais.length > 0 ? (
                            <List disablePadding>
                                {editais.map((edital) => <EditalCard key={edital.id} edital={edital} onSolicitarAnalise={handleSolicitarAnalise} onVerAnalise={handleVerAnalise} actionLoading={actionLoading} isSelected={selectedEdital?.id === edital.id} />)}
                            </List>
                        ) : (<Typography>Nenhum edital cadastrado.</Typography>)}
                    </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="h2">Resultado Detalhado da Análise</Typography>
                        {selectedEdital && (<Button variant="contained" color="secondary" startIcon={<GetAppIcon />} onClick={exportarParaPDF}>Exportar Relatório</Button>)}
                    </Box>
                     {loading && selectedEdital && <CircularProgress size={24} />}
                     {selectedEdital ? (
                        <AnaliseDetalhada edital={selectedEdital} />
                    ) : (
                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', bgcolor: 'action.hover' }}>
                            <Typography color="text.secondary">Selecione um edital analisado na lista à esquerda para ver os detalhes.</Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}

export default AnaliseEditaisLicitacao;