
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Подключение к OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

router.post('/gpt', async (req, res) => {
  
const prompt = req.body.prompt;

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

export default router;