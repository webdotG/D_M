
import express from 'express';

const router = express.Router();

import OpenAI from 'openai';

// Подключение к OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


router.post('/api/chatAI', async (req, res) => {
const prompt = req.body.prompt;
console.log('OPEN AI PROMPT >>> : ', prompt)
try {
    const response = await openai.completions.create({
    model: "gpt-3.5-turbo",
    prompt: prompt,
    max_tokens: 350,
    });
  
    res.json({ response: response.choices[0].text.trim() });
    console.log('RESPONSE',response)
} catch (error) {
    res.status(500).send(error.message);
}
});