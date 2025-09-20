import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export async function generateReply({ message, history = [], language = 'en' }) {
  const system = language === 'hi' ? 'You are UdaanAI, a helpful career mentor speaking Hindi.' : 'You are UdaanAI, a helpful career mentor speaking English.';
  const prompt = system + "\nConversation:\n" + history.map(h => `${h.role}: ${h.content}`).join('\n') + "\nUser: " + message + "\nAssistant:";
  const url = 'https://generativeai.googleapis.com/v1beta2/models/gemini-1.5-preview:generateText';
  const body = { prompt: { text: prompt }, temperature: 0.3, maxOutputTokens: 250 };
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GEMINI_API_KEY}` }, body: JSON.stringify(body) });
  if (!res.ok) { const txt = await res.text(); throw new Error('Gemini API error: ' + txt); }
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content || data?.output?.[0]?.content || JSON.stringify(data);
  return reply;
}
