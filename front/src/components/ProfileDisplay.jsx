// Exemplo em um novo componente ProfileDisplay.jsx
import React, { useState, useEffect } from 'react';

function ProfileDisplay() {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('accessToken');
            console.log('Token recuperado do localStorage:', token); // <--- log de verificação de erro ao fazer o login
            console.log('Token sendo usado para /users/me/:', token);
            if (!token) {
                setError('Token não encontrado. Faça login.');
                setIsLoading(false);
                // Aqui você pode redirecionar para a página de login
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/users/me/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    console.log("Dados do usuário /me/ recebidos:", data);
                    // Verifique aqui data.is_staff e data.is_superuser
                } else {
                    // Tratar token expirado/inválido ou outros erros
                    setError('Não foi possível buscar os dados do usuário. Sua sessão pode ter expirado.');
                    console.error("Erro ao buscar /users/me/", response);
                }
            } catch (err) {
                setError('Erro de rede ao buscar perfil.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    if (isLoading) return <p>Carregando dados do usuário...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!userData) return <p>Não foi possível carregar os dados.</p>;

    return (
        <div>
            <h2>Bem-vindo(a), {userData.username}!</h2>
            <p>Email: {userData.email}</p>
            <p>Staff: {userData.is_staff ? 'Sim' : 'Não'}</p>
            <p>Superuser: {userData.is_superuser ? 'Sim' : 'Não'}</p>
            {userData.profile && (
                <div>
                    <h3>Perfil</h3>
                    <p>Empresa: {userData.profile.company_name || 'N/A'}</p>
                    <p>Tipo de Conta: {userData.profile.account_type_display}</p>
                </div>
            )}
        </div>
    );
}

export default ProfileDisplay;