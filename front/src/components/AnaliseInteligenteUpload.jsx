import React, { useState } from 'react';

const AnaliseInteligenteUpload = () => {
  const [arquivo, setArquivo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [progresso, setProgresso] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setArquivo(file);
    setError(null);
    setResultado(null);
    setProgresso(0);
  };

  const handleAnalise = async () => {
    if (!arquivo) {
      setError('Por favor, selecione um arquivo PDF');
      return;
    }

    if (!arquivo.name.toLowerCase().endsWith('.pdf')) {
      setError('Apenas arquivos PDF são aceitos');
      return;
    }

    setUploading(true);
    setError(null);
    setProgresso(0);
    
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgresso(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Usar a API de análise direta que você já tem
      const response = await fetch('http://127.0.0.1:8000/api/v1/analise-direta/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setProgresso(100);

      if (response.ok) {
        const dados = await response.json();
        setResultado(dados);
        console.log('Análise realizada com sucesso:', dados);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro na análise');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError(error.message);
    } finally {
      setUploading(false);
      setTimeout(() => setProgresso(0), 1000);
    }
  };

  const resetForm = () => {
    setArquivo(null);
    setResultado(null);
    setError(null);
    setProgresso(0);
    // Limpar o input de arquivo
    const fileInput = document.getElementById('arquivo-analise-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formatarTextoAnalise = (texto) => {
    if (!texto) return 'Análise não disponível';
    
    return texto
      .replace(/# (.*)/g, '<h2 style="font-size: 1.5rem; font-weight: bold; color: #1976d2; margin: 1rem 0;">$1</h2>')
      .replace(/## (.*)/g, '<h3 style="font-size: 1.25rem; font-weight: 600; color: #42a5f5; margin: 0.75rem 0;">$1</h3>')
      .replace(/### (.*)/g, '<h4 style="font-size: 1.1rem; font-weight: 500; color: #64b5f6; margin: 0.5rem 0;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')
      .replace(/- (.*)/g, '<div style="margin-left: 1rem; margin-bottom: 0.25rem;">• $1</div>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  const baixarDadosJSON = () => {
    if (!resultado?.dados_extraidos) return;
    
    const dataStr = JSON.stringify(resultado.dados_extraidos, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analise-${arquivo.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1B263B',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #374151'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>🧠</span>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
            Análise Inteligente de Edital
          </h1>
        </div>
        <p style={{ color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
          Envie qualquer edital em PDF e receba uma análise detalhada com IA. 
          Não é necessário vincular a uma licitação cadastrada.
        </p>
      </div>

      {/* Upload Area */}
      <div style={{
        backgroundColor: '#1B263B',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #374151'
      }}>
        <h2 style={{ color: 'white', marginTop: 0, marginBottom: '1rem' }}>
          📄 Selecione o Edital para Análise
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <input
            id="arquivo-analise-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="arquivo-analise-input">
            <div style={{
              width: '100%',
              padding: '2rem',
              border: '2px dashed #3b82f6',
              borderRadius: '8px',
              backgroundColor: '#374151',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: '#4b5563'
              }
            }}>
              {arquivo ? (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</div>
                  <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: '500' }}>
                    {arquivo.name}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>☁️</div>
                  <div style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    Clique para selecionar arquivo PDF
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    Ou arraste e solte aqui
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Progresso */}
        {uploading && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #374151',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ color: '#d1d5db' }}>Processando e analisando com IA...</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#374151',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progresso}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        )}

        {/* Botão de Análise */}
        <button
          onClick={handleAnalise}
          disabled={uploading || !arquivo}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: uploading || !arquivo ? '#6b7280' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: uploading || !arquivo ? 'not-allowed' : 'pointer',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span>📊</span>
          {uploading ? 'Analisando...' : '🤖 Analisar com Inteligência Artificial'}
        </button>

        {/* Área de Erro */}
        {error && (
          <div style={{
            backgroundColor: '#7f1d1d',
            border: '1px solid #dc2626',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#fca5a5', margin: 0 }}>❌ {error}</p>
          </div>
        )}
      </div>

      {/* Resultado da Análise */}
      {resultado && (
        <div style={{
          backgroundColor: '#1B263B',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ color: '#10b981', fontSize: '1.5rem' }}>✅</span>
            <h2 style={{ color: '#10b981', margin: 0 }}>
              Análise Concluída com Sucesso!
            </h2>
          </div>

          {/* Estatísticas da Análise */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>
              Estatísticas da Análise:
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              backgroundColor: '#0d1b2a',
              padding: '1rem',
              borderRadius: '6px'
            }}>
              <div style={{ color: '#d1d5db' }}>
                📄 <strong>{resultado.nome_arquivo}</strong>
              </div>
              <div style={{ color: '#d1d5db' }}>
                📊 <strong>{resultado.dados_extraidos?.total_documentos || 0}</strong> documentos
              </div>
              <div style={{ color: '#d1d5db' }}>
                📜 <strong>{resultado.dados_extraidos?.total_certidoes || 0}</strong> certidões
              </div>
              <div style={{ color: '#d1d5db' }}>
                ✍️ <strong>{resultado.dados_extraidos?.total_declaracoes || 0}</strong> declarações
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #374151', margin: '1rem 0' }} />

          {/* Resultado Detalhado */}
          <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>
            🤖 Análise Detalhada
          </h3>
          
          <div
            style={{
              maxHeight: '600px',
              overflow: 'auto',
              padding: '1rem',
              backgroundColor: '#0D1B2A',
              borderRadius: '6px',
              border: '1px solid #374151',
              marginBottom: '1rem',
              color: '#d1d5db',
              lineHeight: 1.6
            }}
            dangerouslySetInnerHTML={{
              __html: formatarTextoAnalise(resultado.resumo_analise)
            }}
          />

          {/* Ações */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={resetForm}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📄 Analisar Outro Edital
            </button>
            
            {resultado.dados_extraidos && (
              <button
                onClick={baixarDadosJSON}
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📥 Baixar Dados JSON
              </button>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AnaliseInteligenteUpload;