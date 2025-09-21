import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profilecard.css';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5004';
export default function ProfileCard(){
  const [profile, setProfile] = useState(null);
  useEffect(()=> {
    const id = localStorage.getItem('udaan_studentId');
    if (id) {
      axios.get(`${API}/mentor/studentinfo?id=${id}`).then(res=> setProfile(res.data)).catch(()=>{});
    } else {
      // anonymous guest created in MentorChat
    }
    // listen for postMessage from OAuth popup
    const handler = (e) => {
      if (!e.data || e.data.source !== 'udaanai-linkedin') return;
      const { studentId } = e.data.data;
      if (studentId) axios.get(`${API}/mentor/studentinfo?id=${studentId}`).then(res=> setProfile(res.data)).catch(console.error);
    };
    window.addEventListener('message', handler);
    return ()=> window.removeEventListener('message', handler);
  }, []);
  const award = async () => {
    if (!profile || !profile._id) return;
    await axios.post(`${API}/mentor/badges/award`, { studentId: profile._id, key:'starter', title:'Getting Started', description:'Imported profile' });
    alert('Badge awarded');
    const res = await axios.get(`${API}/mentor/studentinfo?id=${profile._id}`);
    setProfile(res.data);
  };
  return (
    <div className="profile-card glass">
      {!profile ? (
        <div style={{textAlign:'center'}}>
          <div className="avatar">UA</div>
          <div className="muted">No profile loaded</div>
          <div style={{marginTop:12}}>
            <button className="btn ghost" onClick={()=> window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5004'}/auth/linkedin`, 'linkedin', 'width=600,height=700')}>Import from LinkedIn</button>
          </div>
        </div>
      ) : (
        <>
          <div className="avatar-wrap"><div className="avatar">{profile.name?.[0]||'U'}</div><div><div className="name">{profile.name}</div><div className="muted">{profile.email}</div></div></div>
          {profile.headline && <div className="headline">“{profile.headline}”</div>}
          <div className="section">
            <h4>Education</h4>
            <ul>{(profile.education||[]).map((e,i)=><li key={i}>{e}</li>)}</ul>
          </div>
          <div className="section">
            <h4>Skills</h4>
            <div className="skills">{(profile.skills||[]).map((s,i)=><span key={i} className="skill-pill">{s}</span>)}</div>
          </div>
          <div style={{marginTop:10}}>
            <button className="btn" onClick={award}>Award Badge</button>
          </div>
        </>
      )}
    </div>
  );
}
