import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LinkedInImport from './LinkedInImport';
import Badges from './Badges';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5004';
export default function MentorChat(){
  const [studentId, setStudentId] = useState(localStorage.getItem('udaan_studentId') || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(()=> {
    if (!studentId) {
      axios.post(`${API}/mentor/student`, { name: 'Guest', skills: [] })
        .then(res => {
          setStudentId(res.data._id);
          localStorage.setItem('udaan_studentId', res.data._id);
        }).catch(console.error);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); if (audioRef.current) audioRef.current.pause(); }
  }, []);
  const send = async () => {
    if (!input) return;
    setMessages(prev=> [...prev, { sender: 'user', text: input }]);
    try {
      const res = await axios.post(`${API}/mentor/chat`, { studentId, message: input, language });
      setMessages(prev=> [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) { console.error(err); }
    setInput('');
  };
  const playBase64Audio = async (b64) => {
    try {
      const binary = atob(b64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      setIsPlaying(true);
      audio.play();
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        const levels = [
          Math.max(...data.slice(2,10)),
          Math.max(...data.slice(10,30)),
          Math.max(...data.slice(30,60)),
          Math.max(...data.slice(60,90)),
          Math.max(...data.slice(90,120))
        ];
        document.documentElement.style.setProperty('--bar1', `${Math.max(6, levels[0]/2)}px`);
        document.documentElement.style.setProperty('--bar2', `${Math.max(6, levels[1]/2)}px`);
        document.documentElement.style.setProperty('--bar3', `${Math.max(6, levels[2]/2)}px`);
        document.documentElement.style.setProperty('--bar4', `${Math.max(6, levels[3]/2)}px`);
        document.documentElement.style.setProperty('--bar5', `${Math.max(6, levels[4]/2)}px`);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      audio.onended = () => {
        setIsPlaying(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        document.documentElement.style.setProperty('--bar1', '6px');
        document.documentElement.style.setProperty('--bar2', '6px');
        document.documentElement.style.setProperty('--bar3', '6px');
        document.documentElement.style.setProperty('--bar4', '6px');
        document.documentElement.style.setProperty('--bar5', '6px');
        ctx.close();
      };
    } catch (e) { console.error('play error', e); setIsPlaying(false); }
  };
  const speak = async () => {
    if (!input) return;
    setMessages(prev=> [...prev, { sender: 'user', text: input }]);
    try {
      const res = await axios.post(`${API}/mentor/voice`, { studentId, message: input, language });
      setMessages(prev=> [...prev, { sender: 'ai', text: res.data.reply }]);
      if (res.data.audio) await playBase64Audio(res.data.audio);
    } catch (err) { console.error(err); setIsPlaying(false); }
    setInput('');
  };
  return (
    <div className="mentor-card">
      <div className="mentor-header">
        <div>
          <h2 className="title">UdaanAI Mentor</h2>
          <div className="sub">Take off to your career future</div>
        </div>
        <div className="controls">
          <select value={language} onChange={e=>setLanguage(e.target.value)} className="lang">
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="bn">🇧🇩 Bengali</option>
          </select>
          <LinkedInImport setStudentId={setStudentId} />
        </div>
      </div>
      <div className={`chat-window ${isPlaying ? 'speaking' : ''}`}>
        {messages.map((m,i)=>(
          <div key={i} className={`bubble ${m.sender==='user' ? 'bubble-user' : 'bubble-ai'}`}>{m.text}</div>
        ))}
      </div>
      <div className="input-area">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask your mentor..." />
        <div className="buttons">
          <button className="btn outline" onClick={send}>Send</button>
          <button className={`mic ${isPlaying ? 'glow' : ''}`} onClick={speak} title="Speak & Hear">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
        </div>
      </div>
      <div className="waveform">
        <div className={`bars ${isPlaying ? 'active' : ''}`}>
          <div className="bar b1" style={{height:'var(--bar1)'}} />
          <div className="bar b2" style={{height:'var(--bar2)'}} />
          <div className="bar b3" style={{height:'var(--bar3)'}} />
          <div className="bar b4" style={{height:'var(--bar4)'}} />
          <div className="bar b5" style={{height:'var(--bar5)'}} />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Badges studentId={studentId} />
      </div>
    </div>
  );
}
