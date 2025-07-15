import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import LicitacoesPage from './components/LicitacoesPage';
import AnaliseEditaisLicitacao from './components/AnaliseEditaisLicitacao';
import PaginaNovaAnalise from './components/PaginaNovaAnalise';
import api from './services/api';

// Importações do MUI
import { 
    ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Drawer, 
    List, ListItemButton, ListItemIcon, ListItemText, Typography, Button, 
    CircularProgress // <<< IMPORTAÇÃO CORRIGIDA AQUI
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'; // Um novo ícone para o menu
// Seu tema escuro
const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: { default: '#0D1B2A', paper: '#1B263B' },
      text: { primary: '#E0E1DD', secondary: '#A9A9A9' },
    },
});
const drawerWidth = 250;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedLicitacaoId, setSelectedLicitacaoId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setSelectedLicitacaoId(null);
    setUserData(null);
    setCurrentPage('login');
  }, []);

  const checkAuthAndFetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await api.get('/users/me/', { headers: { 'Authorization': `Bearer ${token}` } });
        if (response.ok) {
          const data = response.data;
          setUserData(data);
          setIsLoggedIn(true);
          setCurrentPage('home');
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setCurrentPage('login');
    }
    setLoading(false);
  }, [handleLogout]);

  useEffect(() => {
    checkAuthAndFetchUser();
  }, [checkAuthAndFetchUser]);

  const handleLoginSuccess = () => {
    setLoading(true);

    checkAuthAndFetchUser();
  };

  const navigateTo = (page, params = {}) => {
    if (page === 'analise-licitacao' && params.licitacaoId) {
      setSelectedLicitacaoId(params.licitacaoId);
    } else {
      setSelectedLicitacaoId(null);
    }
    setCurrentPage(page);
  };
  
  if (loading) {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="inherit" />
            </Box>
        </ThemeProvider>
    );
  }

  if (!isLoggedIn) {
      return (
          <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              <LoginPage onLoginSuccess={handleLoginSuccess} />
          </ThemeProvider>
      );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1B263B', boxShadow: 'none', borderBottom: '1px solid #415A77' }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Plataforma de Análise de Licitações
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Sair</Button>
          </Toolbar>
        </AppBar>
        
        <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#1B263B', borderRight: '1px solid #415A77', color: '#E0E1DD' } }}>
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItemButton onClick={() => navigateTo('home')} selected={currentPage === 'home'}>
                <ListItemIcon sx={{ color: 'inherit' }}><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton onClick={() => navigateTo('licitacoes')} selected={currentPage === 'licitacoes'}>
                <ListItemIcon sx={{ color: 'inherit' }}><GavelIcon /></ListItemIcon>
                <ListItemText primary="Licitações" />
              </ListItemButton>
           {/* <<< 2. ADICIONE O NOVO ITEM DE MENU AQUI >>> */}
                            <ListItemButton onClick={() => navigateTo('nova-analise')} selected={currentPage === 'nova-analise'}>
                                <ListItemIcon sx={{ color: 'inherit' }}><AddToPhotosIcon /></ListItemIcon>
                                <ListItemText primary="Nova Análise" />
                            </ListItemButton>
                        </List>
                    </Box>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    
                    {/* <<< 3. ADICIONE A RENDERIZAÇÃO DA NOVA PÁGINA AQUI >>> */}
                    {currentPage === 'home' && <HomePage /* ... */ />}
                    {currentPage === 'licitacoes' && <LicitacoesPage /* ... */ />}
                    {currentPage === 'nova-analise' && <PaginaNovaAnalise />}
                    
                    {currentPage === 'analise-licitacao' && selectedLicitacaoId && (
                        <AnaliseEditaisLicitacao licitacaoId={selectedLicitacaoId} />
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;