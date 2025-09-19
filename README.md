UdaanAI - Complete single-repo bundle (Backend + Frontend) with LinkedIn OAuth & UI

Structure:
- backend/ (Express, MongoDB)
  - routes/auth_linkedin.js  (OAuth + mock parser + fallback)
  - routes/mentor.js        (chat, voice (base64), badges, studentinfo)
  - utils/gemini.js         (calls Gemini)
  - utils/tts.js            (Google TTS wrapper)
  - models/Student.js
  - models/Conversation.js
  - public/linkedin-success.html

- frontend/ (React + Parcel)
  - src/components/* (MentorLayout, MentorChat, ProfileCard, SkillProgressRing, LinkedInImport, Badges)
  - src/styles/*

Quick start (backend):
1. cd backend
2. npm install
3. Create .env with:
   GEMINI_API_KEY=...
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcp-key.json
   MONGO_URI=mongodb://localhost:27017/udaanair
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   LINKEDIN_REDIRECT_URI=http://localhost:5004/auth/linkedin/callback
   LINKEDIN_FRONTEND_SUCCESS=http://localhost:5004/auth/linkedin/success
4. node server.js

Quick start (frontend):
1. cd frontend
2. npm install
3. create .env with REACT_APP_API_URL=http://localhost:5004
4. npm start

Notes:
- The LinkedIn OAuth flow requires exact redirect URI matching in LinkedIn Developer settings.
- Education and skills are mocked for demo purposes (to avoid needing extended LinkedIn permissions).
- The backend voice endpoint returns base64 audio for instant playback; ensure GOOGLE_APPLICATION_CREDENTIALS and TTS enabled.

