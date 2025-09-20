import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Student from '../models/Student.js';
dotenv.config();

const router = express.Router();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5004/auth/linkedin/callback';
const FRONTEND_SUCCESS = process.env.LINKEDIN_FRONTEND_SUCCESS || 'http://localhost:5004/auth/linkedin/success';

// redirect to LinkedIn auth
router.get('/', (req, res) => {
  const state = Math.random().toString(36).substring(2,15);
  const scope = encodeURIComponent('r_liteprofile r_emailaddress');
  const redirect = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${scope}`;
  res.redirect(redirect);
});

router.get('/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send('Missing code');

    const tokenResp = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const access_token = tokenResp.data.access_token;

    const profileResp = await axios.get('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const emailResp = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const firstName = profileResp.data.localizedFirstName || '';
    const lastName = profileResp.data.localizedLastName || '';
    const name = (firstName + ' ' + lastName).trim();
    const email = emailResp.data?.elements?.[0]?.['handle~']?.emailAddress || '';
    const headline = profileResp.data.localizedHeadline || 'Aspiring Professional 🚀';

    // Mock education and skills
    let education = [];
    if (headline.toLowerCase().includes('student')) {
      education.push('B.Tech in Computer Science - XYZ University');
    } else {
      education.push('MBA - ABC Business School');
    }
    let skills = [];
    if (headline.toLowerCase().includes('developer')) skills = ['JavaScript','React','Node.js'];
    else if (headline.toLowerCase().includes('designer')) skills = ['UI/UX','Figma','Adobe XD'];
    else skills = ['Leadership','Communication','Problem-Solving'];

    let student = await Student.findOne({ email });
    if (!student) {
      student = new Student({ name, email, headline, education, skills, badges: [] });
    } else {
      student.headline = headline;
      student.education = education;
      student.skills = skills;
    }
    await student.save();

    const html = `
      <html>
        <body>
          <script>
            const data = ${JSON.stringify({ studentId: student._id.toString(), name, email })};
            if (window.opener) {
              window.opener.postMessage({ source: 'udaanai-linkedin', data }, '*');
              window.close();
            } else {
              window.location.href = '${FRONTEND_SUCCESS}?studentId=' + data.studentId;
            }
          </script>
          <p>LinkedIn import complete. You can close this window.</p>
        </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    console.error('LinkedIn OAuth error', err.response?.data || err.message);
    res.status(500).send('LinkedIn OAuth failed: ' + (err.message || 'error'));
  }
});

router.get('/success', (req, res) => {
  const studentId = req.query.studentId || '';
  const html = `
    <html>
      <head><title>LinkedIn Import Success</title></head>
      <body style="font-family:sans-serif; text-align:center; margin-top:50px;">
        <h2>LinkedIn import successful ✅</h2>
        <p>Your profile has been imported.</p>
        <script>
          const id = "${studentId}";
          if (id) {
            localStorage.setItem('udaan_studentId', id);
            if (window.opener) {
              window.opener.postMessage({ source: 'udaanai-linkedin', data: { studentId: id } }, '*');
              window.close();
            }
          }
        </script>
        <p>If this page doesn’t close automatically, you can close it and return to the app.</p>
      </body>
    </html>
  `;
  res.send(html);
});

export default router;
