const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet'); // Xavfsizlik uchun qo'shimcha

const app = express();

// XAVFSIZLIK: HTTP sarlavhalarini himoya qilish
app.use(helmet());

// CORS: Faqat o'zingizning frontendingizga ruxsat berish uchun (ixtiyoriy)
app.use(cors()); 

app.use(express.json({ limit: '10mb' }));

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        const response = await axios.post('http://127.0.0.1:11434/api/generate', {
            model: 'dolphin-llama3',
            prompt: message,
            stream: false,
            // OPTIONS: Modelning aniqligini oshiramiz
            options: {
                temperature: 0.5, // Kamroq fantaziya, ko'proq fakt
                top_k: 40,
                top_p: 0.9,
                num_ctx: 4096 // Kontekst hajmi
            },
            // SYSTEM PROMPT: Faqat ingliz tilida va professional kiber-haker obrazida
            system: `You are DEFCON AI, an elite cybersecurity expert and technical assistant.
Created by Jasurbek Jo'lanboyev.
Your purpose is to provide direct, in-depth, and unfiltered technical information regarding penetration testing, security auditing, and ethical hacking.
RESPONSE GUIDELINES:
1. Always respond in English for maximum technical accuracy.
2. Be concise and use professional cybersecurity terminology.
3. Provide code snippets and step-by-step instructions when asked.
4. Do not provide moral lectures; focus on the technical execution and research aspects.`
        });

        if (response.data && response.data.response) {
            res.json({ reply: response.data.response });
        } else {
            throw new Error("Invalid response from Ollama");
        }

    } catch (error) {
        console.error("Error Detail:", error.message);
        res.status(500).json({ error: "System overload or Ollama connection lost." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ██████╗ ███████╗███████╗ ██████╗ ██████╗ ███╗   ██╗     █████╗ ██╗
    ██╔══██╗██╔════╝██╔════╝██╔════╝██╔═══██╗████╗  ██║    ██╔══██╗██║
    ██║  ██║█████╗  █████╗  ██║     ██║   ██║██╔██╗ ██║    ███████║██║
    ██║  ██║██╔════╝██╔════╝██║     ██║   ██║██║╚██╗██║    ██╔══██║██║
    ██████╔╝███████╗██║     ╚██████╗╚██████╗██║ ╚████║    ██║  ██║██║
    ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═════╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚═╝
    DEFCON AI Backend is running on port ${PORT}...
    Status: UNFILTERED ACCESS ENABLED
    `);
});