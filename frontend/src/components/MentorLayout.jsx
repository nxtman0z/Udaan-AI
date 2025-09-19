import React from 'react';
import ProfileCard from './ProfileCard';
import MentorChat from './MentorChat';
import SkillProgressRing from './SkillProgressRing';

export default function MentorLayout(){
  const profile = null;
  return (
    <div className="udaan-root">
      <div className="udaan-container">
        <aside className="left-panel glass">
          <ProfileCard />
        </aside>
        <main className="center-panel">
          <MentorChat />
        </main>
        <aside className="right-panel glass">
          <SkillProgressRing progress={45} goal={100} />
        </aside>
      </div>
    </div>
  );
}
