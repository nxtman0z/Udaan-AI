import React, { useEffect } from 'react';
export default function LinkedInImport({ setStudentId }) {
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || e.data.source !== 'udaanai-linkedin') return;
      const { studentId } = e.data.data;
      if (studentId) {
        localStorage.setItem('udaan_studentId', studentId);
        setStudentId(studentId);
        alert('Imported LinkedIn profile');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [setStudentId]);
  const openPopup = () => {
    const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5004'}/auth/linkedin`;
    window.open(url, 'linkedin_oauth', 'width=600,height=700');
  };
  return <button className="btn ghost" onClick={openPopup}>Connect LinkedIn</button>;
}
