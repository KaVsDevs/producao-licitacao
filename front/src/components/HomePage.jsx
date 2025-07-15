// src/components/HomePage.jsx (com a correção do Grid)

import React from 'react';
import { Box, Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const recentLicitacoes = [ { id: 1, numero: 'Pregão Eletrônico 90010/2025', status: 'Em Análise', prazo: '20/06/2025' } /* ... */ ];

function HomePage({ navigateTo, userData }) { 
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>Bem-vindo(a), {userData?.first_name || userData?.username || 'Usuário'}!</Typography>
                <Typography variant="subtitle1" sx={{ color: '#A9A9A9' }}>Resumo de suas atividades na plataforma.</Typography>
            </Box>

            {/* <<< CORREÇÃO 3: A prop "item" foi removida dos 4 Grids abaixo >>> */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, bgcolor: '#1B263B', borderLeft: `4px solid #3498DB`, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}><AnalyticsIcon sx={{ fontSize: 40, mr: 2, color: '#3498DB' }} /><Box><Typography variant="h5" component="p" sx={{ color: 'white', fontWeight: 'bold' }}>12</Typography><Typography sx={{ color: '#A9A9A9' }}>Análises Ativas</Typography></Box></Box>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                     <Paper sx={{ p: 2, bgcolor: '#1B263B', borderLeft: `4px solid #E74C3C`, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}><AssignmentLateIcon sx={{ fontSize: 40, mr: 2, color: '#E74C3C' }} /><Box><Typography variant="h5" component="p" sx={{ color: 'white', fontWeight: 'bold' }}>3</Typography><Typography sx={{ color: '#A9A9A9' }}>Prazos Próximos</Typography></Box></Box>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, bgcolor: '#1B263B', borderLeft: `4px solid #2ECC71`, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}><CheckCircleOutlineIcon sx={{ fontSize: 40, mr: 2, color: '#2ECC71' }} /><Box><Typography variant="h5" component="p" sx={{ color: 'white', fontWeight: 'bold' }}>28</Typography><Typography sx={{ color: '#A9A9A9' }}>Análises Concluídas</Typography></Box></Box>
                    </Paper>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <Button variant="outlined" size="large" fullWidth startIcon={<AddCircleOutlineIcon />} sx={{ height: '100%', color: '#E0E1DD', borderColor: '#415A77', '&:hover': { borderColor: 'white', bgcolor: '#2a3a5e' } }} onClick={() => navigateTo('licitacoes')}>
                        Ver Licitações
                    </Button>
                </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom sx={{ mb: 2, color: 'white' }}>Atividade Recente</Typography>
            <Paper sx={{ bgcolor: '#1B263B' }}>
                <TableContainer>
                    <Table>
                        {/* ... sua tabela ... */}
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default HomePage;