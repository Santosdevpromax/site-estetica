const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());

// Permite ler arquivos estáticos da raiz e da pasta public
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

const initialData = {
    heroTitle: "Cuidado minimalista, resultados extraordinários.",
    heroSubtitle: "Protocolos estéticos avançados focados em rejuvenescimento natural, saúde da pele.",
    aboutTitle: "Alcione Pacheco Estética Avançada",
    aboutText1: "Combinando ciência de ponta com um olhar refinado para a harmonia natural do rosto.",
    aboutText2: "Cada protocolo é cuidadosamente desenhado após uma avaliação minuciosa, garantindo resultados.",
    phone: "(11) 99999-9999",
    address: "Atendimento Presencial com Hora Marcada",
    treatments: [
        {
            icon: "fa-sparkles",
            name: "Limpeza De Pele Deep Glow",
            desc: "Higienização profunda com extração delicada, peeling de diamantes e fototerapia.",
            time: "60 min"
        },
        {
            icon: "fa-wand-magic-sparkles",
            name: "Bioestimulação de Colágeno",
            desc: "Tratamento focado na firmeza e rejuvenescimento tissular, estimulando as fibras.",
            time: "45 min"
        },
        {
            icon: "fa-feather-pointed",
            name: "Contorno & Harmonização Subtle",
            desc: "Aprimoramento dos traços faciais com técnica refinada que prioriza a naturalidade.",
            time: "60 min"
        }
    ]
};

const DATA_FILE = path.join(__dirname, 'data.json');

// Rota Principal (Carrega index.html automaticamente)
app.get('/', (req, res) => {
    const publicIndex = path.join(__dirname, 'public', 'index.html');
    const rootIndex = path.join(__dirname, 'index.html');
    
    if (fs.existsSync(publicIndex)) {
        return res.sendFile(publicIndex);
    } else if (fs.existsSync(rootIndex)) {
        return res.sendFile(rootIndex);
    }
    res.status(404).send("Arquivo index.html não foi encontrado no projeto.");
});

// GET API
app.get('/api/content', (req, res) => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return res.json(JSON.parse(data));
        }
        res.json(initialData);
    } catch (err) {
        res.json(initialData);
    }
});

// POST API
app.post('/api/content', (req, res) => {
    res.status(400).json({ error: "Salvamento não suportado em ambiente Serverless." });
});

// Rota Admin
app.get('/admin', (req, res) => {
    const publicAdmin = path.join(__dirname, 'public', 'admin.html');
    const rootAdmin = path.join(__dirname, 'admin.html');
    
    if (fs.existsSync(publicAdmin)) {
        return res.sendFile(publicAdmin);
    } else if (fs.existsSync(rootAdmin)) {
        return res.sendFile(rootAdmin);
    }
    res.status(404).send("Arquivo admin.html não foi encontrado no projeto.");
});

module.exports = app;