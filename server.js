const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initial data check
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        heroTitle: "Cuidado minimalista, resultados extraordinários.",
        heroSubtitle: "Protocolos estéticos avançados focados em rejuvenescimento natural, saúde da pele e bem-estar integrado com atendimento exclusivo.",
        aboutTitle: "Alcione Pacheco Estética Avançada",
        aboutText1: "Combinando ciência de ponta com um olhar refinado para a harmonia natural do rosto e do corpo, nossa clínica é um refúgio para quem busca cuidar da pele com elegância.",
        aboutText2: "Cada protocolo é cuidadosamente desenhado após uma avaliação minuciosa, garantindo segurança, conforto e resultados visíveis desde as primeiras sessões.",
        phone: "(11) 99999-9999",
        address: "Atendimento Presencial com Hora Marcada",
        treatments: [
            {
                icon: "fa-sparkles",
                name: "Limpeza de Pele Deep Glow",
                desc: "Higienização profunda com extração delicada, peeling de diamantes e fototerapia LED para restauração instantânea do viço.",
                time: "60 min"
            },
            {
                icon: "fa-wand-magic-sparkles",
                name: "Bioestimulação de Colágeno",
                desc: "Tratamento focado na firmeza e rejuvenescimento tissular, estimulando as fibras elásticas de forma natural.",
                time: "45 min"
            },
            {
                icon: "fa-feather-pointed",
                name: "Contorno & Harmonização Subtle",
                desc: "Aprimoramento dos traços faciais com técnica refinada que prioriza a naturalidade e equilíbrio dos volumes.",
                time: "60 min"
            }
        ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// GET API
app.get('/api/content', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Erro ao ler arquivo" });
        res.json(JSON.parse(data));
    });
});

// POST API
app.post('/api/content', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Erro ao salvar arquivo" });
        res.json({ success: true, message: "Conteúdo atualizado!" });
    });
});

// Admin Route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Painel Admin em http://localhost:${PORT}/admin`);
});
