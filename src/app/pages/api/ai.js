// pages/api/ai.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.body;

  try {
    // Make sure this endpoint corresponds to Ollama's local setup
    const response = await axios.post('http://127.0.0.1:11434/api/chat', {
      prompt: query, // Send the query to Ollama as the prompt
    });

    // Send the response from Ollama back to the client
    res.status(200).json({ result: response.data.result });
  } catch (error) {
    console.error('Error fetching from Ollama:', error);
    res.status(500).json({ error: 'Failed to fetch AI response from Ollama' });
  }
}
