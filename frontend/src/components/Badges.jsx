import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5004';
export default function Badges({ studentId }) {
  const [badges, setBadges] = useState([]);
  useEffect(()=> {
    if (!studentId) return;
    axios.get(`${API}/mentor/badges/${studentId}`).then(res=> setBadges(res.data.badges || [])).catch(console.error);
  }, [studentId]);
  return (<div className="badges-wrap">{badges.map((b,i)=>(<div key={i} className="badge-pill">{b.title}</div>))}</div>);
}
