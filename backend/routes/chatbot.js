const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'llama3.2',
      messages,
      stream: false // ensures full response if needed
    });

    // Debug log (temporarily):
    console.log('Ollama response:', JSON.stringify(response.data, null, 2));

    const reply =
      response.data.message?.content ||
      response.data.choices?.[0]?.message?.content ||
      '⚠️ No valid content returned by the model.';

    res.json({ reply });
  } catch (err) {
    console.error('Chatbot route error:', err.message);
    res.status(500).json({ error: 'LLM error' });
  }
});

module.exports = router;
