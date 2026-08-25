const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Cole aqui suas credenciais do JSONBin.io
const JSONBIN_BIN_ID = '6a8d25d9da38895dfe0d54aa';
const JSONBIN_MASTER_KEY = '$2a$10$pqK/RRsBQUtlA6zpFiCapOonDsnDdQe3BEdxS3hm8lRv4JnC7iE1O';

// GET API - Busca os dados atualizados do banco
app.get('/api/content', async (req, res) => {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_MASTER_KEY
            }
        });
        const data = await response.json();
        return res.json(data.record);
    } catch (err) {
        return res.status(500).json({ error: "Erro ao carregar dados do banco." });
    }
});

// POST API - Salva as alterações no banco
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

// Rotas de exibição
app.get('/', (req, res) => {
    const publicIndex = path.join(__dirname, 'public', 'index.html');
    const rootIndex = path.join(__dirname, 'index.html');
    res.sendFile(fs.existsSync(publicIndex) ? publicIndex : rootIndex);
});

app.get('/admin', (req, res) => {
    const publicAdmin = path.join(__dirname, 'public', 'admin.html');
    const rootAdmin = path.join(__dirname, 'admin.html');
    res.sendFile(fs.existsSync(publicAdmin) ? publicAdmin : rootAdmin);
});

module.exports = app;