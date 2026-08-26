const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middlewares essenciais
app.use(express.json());

// Libera conexões (CORS) para o Painel Adm salvar sem bloqueio do navegador
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Servidor de arquivos estáticos
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Credenciais do JSONBin.io
const JSONBIN_BIN_ID = '6a8d25d9da38895dfe0d54aa';
const JSONBIN_MASTER_KEY = '$2a$10$pqK/RRsBQUtlA6zpFiCapOonDsnDdQe3BEdxS3hm8lRv4JnC7iE10';

// API GET - Busca dados atualizados do banco
app.get('/api/content', async (req, res) => {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_MASTER_KEY
      }
    });
    const data = await response.json();
    return res.json(data.record || {});
  } catch (err) {
    return res.status(500).json({ error: "Erro ao carregar dados do banco." });
  }
});

// API POST - Salva as alterações feitas no Painel Adm
app.post('/api/content', async (req, res) => {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_MASTER_KEY
      },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      return res.json({ message: "Conteúdo salvo com sucesso!" });
    }
    const errData = await response.json();
    return res.status(500).json({ error: "Erro ao salvar no JSONBin.", detail: errData });
  } catch (err) {
    return res.status(500).json({ error: "Erro de conexão com o banco." });
  }
});

// Rota Principal
app.get('/', (req, res) => {
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  const rootIndex = path.join(__dirname, 'index.html');
  res.sendFile(fs.existsSync(publicIndex) ? publicIndex : rootIndex);
});

// Rota do Painel Administrativo
app.get('/admin', (req, res) => {
  const publicAdmin = path.join(__dirname, 'public', 'admin.html');
  const rootAdmin = path.join(__dirname, 'admin.html');
  res.sendFile(fs.existsSync(publicAdmin) ? publicAdmin : rootAdmin);
});

// Inicialização e Exportação para Vercel Serverless
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;