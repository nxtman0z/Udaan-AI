import express from 'express';
import Student from '../models/Student.js';
import Conversation from '../models/Conversation.js';
import { generateReply } from '../utils/gemini.js';
import { synthesizeSpeech } from '../utils/tts.js';

const router = express.Router();

router.post('/student', async (req, res) => {
  try {
    const body = req.body;
    let student;
    if (body._id) {
      student = await Student.findByIdAndUpdate(body._id, body, { new: true, upsert: true });
    } else {
      student = new Student(body);
      await student.save();
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { studentId, message, language='en' } = req.body;
    let history = [];
    if (studentId) {
      const conv = await Conversation.findOne({ studentId });
      if (conv) history = conv.messages.slice(-6);
    }
    const reply = await generateReply({ message, history, language });
    if (studentId) {
      let conv = await Conversation.findOne({ studentId });
      const userMsg = { role: 'user', content: message };
      const assistantMsg = { role: 'assistant', content: reply };
      if (!conv) {
        conv = new Conversation({ studentId, messages: [userMsg, assistantMsg] });
      } else {
        conv.messages.push(userMsg, assistantMsg);
        conv.updatedAt = new Date();
      }
      await conv.save();
    }
    res.json({ reply });
  } catch (err) {
    console.error('chat error', err);
    res.status(500).json({ error: 'chat failed', detail: err.message });
  }
});

router.post('/voice', async (req, res) => {
  try {
    const { studentId, message, language='en' } = req.body;
    const reply = await generateReply({ message, history: [], language });
    const audioBuffer = await synthesizeSpeech({ text: reply, language });
    const buf = Buffer.isBuffer(audioBuffer) ? audioBuffer : Buffer.from(audioBuffer);
    if (studentId) {
      let conv = await Conversation.findOne({ studentId });
      const userMsg = { role: 'user', content: message };
      const assistantMsg = { role: 'assistant', content: reply };
      if (!conv) {
        conv = new Conversation({ studentId, messages: [userMsg, assistantMsg] });
      } else {
        conv.messages.push(userMsg, assistantMsg);
        conv.updatedAt = new Date();
      }
      await conv.save();
    }
    res.json({ reply, audio: buf.toString('base64') });
  } catch (err) {
    console.error('voice error', err);
    res.status(500).json({ error: 'voice failed', detail: err.message });
  }
});

router.post('/badges/award', async (req, res) => {
  try {
    const { studentId, key, title, description } = req.body;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (!student.badges) student.badges = [];
    if (student.badges.some(b => b.key === key)) return res.json({ ok: true, message: 'Badge exists' });
    student.badges.push({ key, title, description, awardedAt: new Date() });
    await student.save();
    res.json({ ok: true, badges: student.badges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/badges/:studentId', async (req, res) => {
  try {
    const s = await Student.findById(req.params.studentId);
    res.json({ badges: s?.badges || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/linkedin/import', async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ error: 'Missing token' });
    const profile = await (await import('axios')).default.get('https://api.linkedin.com/v2/me', { headers: { Authorization: `Bearer ${access_token}` }});
    const email = await (await import('axios')).default.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', { headers: { Authorization: `Bearer ${access_token}` }});
    const name = profile.data.localizedFirstName + ' ' + (profile.data.localizedLastName || '');
    const emailAddr = email.data?.elements?.[0]?.['handle~']?.emailAddress || '';
    res.json({ imported: { name, email: emailAddr } , raw: { profile: profile.data } });
  } catch (err) {
    console.error('LinkedIn import error', err.response?.data || err.message);
    res.status(500).json({ error: 'LinkedIn import failed', detail: err.message });
  }
});

export default router;

// student info endpoint
router.get('/studentinfo', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'id required' });
    const s = await Student.findById(id).lean();
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
