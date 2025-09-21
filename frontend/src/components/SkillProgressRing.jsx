import React from 'react';
import '../styles/skillring.css';
export default function SkillProgressRing({ progress=0, goal=100 }) {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress/goal) * circumference;
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}>
      <div className="progress-ring-container">
        <svg height={radius*2} width={radius*2}>
          <circle stroke="#0b1220" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
          <circle stroke="#06b6d4" fill="transparent" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circumference + ' ' + circumference}
            style={{strokeDashoffset, transition:'stroke-dashoffset 0.6s ease'}}
            r={normalizedRadius} cx={radius} cy={radius} />
        </svg>
        <div className="progress-text">{Math.round((progress/goal)*100)}%</div>
      </div>
    </div>
  );
}
