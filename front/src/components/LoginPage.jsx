import React, { useState } from 'react';

// Importando os componentes e ÍCONES que vamos usar
import {
  Grid, Box, Paper, Typography, TextField, Button, Link, Avatar,
  CircularProgress, Alert, Checkbox, FormControlLabel, IconButton, InputAdornment
} from '@mui/material';

// Ícones
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


function LoginPage({ onLoginSuccess }) {
  // LÓGICA EXISTENTE (sem alterações)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // NOVO ESTADO para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = 'http://127.0.0.1:8000/api/v1/token/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // ... resto da sua função handleSubmit continua igual ...
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setSuccessMessage('Login realizado com sucesso!');
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(data.detail || `Erro ${response.status}: Falha no login.`);
      }
    } catch (networkError) {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para o botão de mostrar/ocultar senha
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // ----- INÍCIO DA PARTE VISUAL ATUALIZADA -----
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Lado Esquerdo - Painel de Branding com Gradiente */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          background: 'linear-gradient(to bottom right, #0D1B2A, #1B263B)', // Gradiente sutil
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4,
        }}
      >
        <GavelIcon sx={{ fontSize: 80, color: '#778DA9', mb: 2 }} />
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
          Análise de Licitações
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#E0E1DD', mt: 1 }}>
          Inteligência e precisão para seus editais.
        </Typography>
      </Grid>

      {/* Lado Direito - Formulário de Login Refinado */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1B263B' }}>
            <AccountBalanceIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'medium' }}>
            Acessar Plataforma
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            {successMessage && !error && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{successMessage}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              InputProps={{ // <- Adicionando ícone no início
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'} // <- Controla o tipo do campo
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              InputProps={{ // <- Adicionando ícone de cadeado e botão de visibilidade
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Lembrar-me"
              sx={{ mt: 1 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2, // Ajuste de espaçamento
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                bgcolor: '#1B263B',
                '&:hover': { bgcolor: '#415A77' },
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Entrar'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" sx={{ color: 'text.secondary' }}>
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" sx={{ color: 'text.secondary' }}>
                  {"Não tem uma conta? Cadastre-se"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage;