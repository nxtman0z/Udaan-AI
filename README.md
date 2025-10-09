# UdaanAI - AI-Powered Career Mentoring Platform

UdaanAI is a comprehensive career mentoring platform that combines LinkedIn OAuth authentication, AI-powered chat mentoring, voice responses, and gamified learning through a badge system. The platform provides personalized career guidance and skill development recommendations.

## 🏗️ Project Structure

```
udaanai/
├── backend/                          # Express.js Backend
│   ├── routes/
│   │   ├── auth_linkedin.js         # LinkedIn OAuth + mock parser + fallback
│   │   └── mentor.js                # Chat, voice (base64), badges, student info
│   ├── utils/
│   │   ├── gemini.js                # Gemini AI integration
│   │   └── tts.js                   # Google Text-to-Speech wrapper
│   ├── models/
│   │   ├── Student.js               # Student data model
│   │   └── Conversation.js          # Chat conversation model
│   ├── public/
│   │   └── linkedin-success.html    # OAuth success page
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── .env                         # Environment variables
│
├── frontend/                        # React Frontend with Parcel
│   ├── src/
│   │   ├── components/
│   │   │   ├── MentorLayout.js      # Main layout component
│   │   │   ├── MentorChat.js        # Chat interface
│   │   │   ├── ProfileCard.js       # User profile display
│   │   │   ├── SkillProgressRing.js # Skill visualization
│   │   │   ├── LinkedInImport.js    # LinkedIn integration
│   │   │   └── Badges.js            # Achievement badges
│   │   ├── styles/                  # CSS styling
│   │   ├── App.js                   # Main React app
│   │   └── index.js                 # React entry point
│   ├── package.json
│   ├── .env                         # Frontend environment variables
│   └── public/
│       └── index.html
│
└── README.md                        # This file
```

## 🚀 Features

- **LinkedIn OAuth Integration**: Secure authentication with LinkedIn
- **AI-Powered Mentoring**: Chat with AI mentor powered by Google Gemini
- **Voice Responses**: Text-to-speech functionality for mentor responses
- **Skill Assessment**: Visual progress tracking with interactive rings
- **Achievement System**: Gamified learning through badges and milestones
- **Profile Management**: Import and manage LinkedIn profile data
- **Responsive Design**: Modern UI that works across all devices

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn** package manager

### External Service Accounts Required:
1. **Google Cloud Platform** account with:
   - Gemini AI API access
   - Text-to-Speech API enabled
   - Service account with JSON credentials
2. **LinkedIn Developer** account with:
   - OAuth application configured
   - Redirect URLs properly set

## ⚡ Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   touch .env
   ```

4. **Configure environment variables**
   Add the following to your `.env` file:
   ```env
   # AI Services
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp-service-account-key.json
   
   # Database
   MONGO_URI=mongodb://localhost:27017/udaanai
   
   # LinkedIn OAuth
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   LINKEDIN_REDIRECT_URI=http://localhost:5004/auth/linkedin/callback
   LINKEDIN_FRONTEND_SUCCESS=http://localhost:5004/auth/linkedin/success
   
   # Server Configuration
   PORT=5004
   NODE_ENV=development
   ```

5. **Start the backend server**
   ```bash
   node server.js
   ```
   
   The backend will be running at `http://localhost:5004`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   touch .env
   ```

4. **Configure frontend environment**
   Add to your `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5004
   ```

5. **Start the development server**
   ```bash
   npm start
   ```
   
   The frontend will be running at `http://localhost:1234` (or as configured by Parcel)

## 🔧 Configuration Details

### LinkedIn OAuth Setup

1. **Create LinkedIn Application**:
   - Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
   - Create a new application
   - Note your Client ID and Client Secret

2. **Configure Redirect URLs**:
   - Add `http://localhost:5004/auth/linkedin/callback` to authorized redirect URLs
   - Ensure exact URL matching (LinkedIn OAuth is strict about this)

3. **Required Permissions**:
   - `r_liteprofile` - Basic profile information
   - `r_emailaddress` - Email access
   - Note: Education and skills are mocked for demo purposes to avoid requiring extended permissions

### Google Cloud Platform Setup

1. **Enable Required APIs**:
   - Gemini AI API
   - Text-to-Speech API

2. **Create Service Account**:
   - Generate JSON credentials file
   - Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable to file path

3. **Set up billing** (required for API usage)

### MongoDB Configuration

- **Local MongoDB**: Use default connection string `mongodb://localhost:27017/udaanai`
- **MongoDB Atlas**: Replace with your Atlas connection string
- The application will automatically create required collections

## 📚 API Endpoints

### Authentication
- `GET /auth/linkedin` - Initiate LinkedIn OAuth flow
- `GET /auth/linkedin/callback` - Handle OAuth callback
- `GET /auth/linkedin/success` - Success page after authentication

### Mentor Services
- `POST /mentor/chat` - Send message to AI mentor
- `POST /mentor/voice` - Get voice response (returns base64 audio)
- `GET /mentor/badges/:studentId` - Get student badges
- `GET /mentor/student-info/:studentId` - Get student information

## 🎯 Key Features Explained

### AI Mentoring System
- Powered by Google Gemini for natural language processing
- Context-aware responses based on student profile and conversation history
- Personalized career guidance and skill recommendations

### Voice Response System
- Google Text-to-Speech integration
- Returns base64-encoded audio for instant playbook
- Supports multiple voice options and languages

### Gamification Elements
- **Badge System**: Achievements for completing milestones
- **Progress Tracking**: Visual skill progress with interactive rings
- **Goal Setting**: Personal development objectives

### LinkedIn Integration
- **OAuth Authentication**: Secure login with LinkedIn credentials
- **Profile Import**: Basic profile information (name, email, headline)
- **Mock Data**: Education and skills are simulated for demo purposes

## 🛠️ Development Notes

### Important Considerations

1. **LinkedIn OAuth Requirements**:
   - Redirect URI must match exactly in LinkedIn Developer settings
   - URLs are case-sensitive and protocol-specific

2. **Voice Feature Dependencies**:
   - Requires valid Google Cloud credentials
   - Text-to-Speech API must be enabled
   - Returns base64 audio for immediate browser playback

3. **Mock Data Implementation**:
   - Education and skills are mocked to avoid requiring extended LinkedIn permissions
   - Real implementation would need additional OAuth scopes

4. **Security Best Practices**:
   - Environment variables for all sensitive data
   - MongoDB connection secured
   - CORS configured for development

### Troubleshooting

**Common Issues:**

1. **LinkedIn OAuth Fails**:
   - Check redirect URI matches exactly
   - Verify client credentials
   - Ensure LinkedIn app is not in draft mode

2. **Voice Responses Not Working**:
   - Verify Google Cloud credentials path
   - Check if Text-to-Speech API is enabled
   - Ensure billing is set up on GCP account

3. **MongoDB Connection Issues**:
   - Verify MongoDB is running locally
   - Check connection string format
   - Ensure network connectivity

## 📦 Dependencies

### Backend Dependencies
- `express` - Web framework
- `mongoose` - MongoDB object modeling
- `passport` - Authentication middleware
- `passport-linkedin-oauth2` - LinkedIn OAuth strategy
- `@google-cloud/text-to-speech` - Google TTS
- `@google/generative-ai` - Gemini AI
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Frontend Dependencies
- `react` - UI framework
- `react-dom` - React DOM utilities
- `lucide-react` - Icon library
- `recharts` - Charting library
- `parcel` - Build tool and bundler

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**:
   - Set production URLs for LinkedIn redirect URIs
   - Use production MongoDB instance
   - Secure API keys and credentials

2. **Build Process**:
   - Frontend: `npm run build`
   - Backend: Ensure all dependencies installed

3. **Security**:
   - Enable HTTPS
   - Set secure session configurations
   - Implement rate limiting
   - Add input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

---

**Happy Learning with UdaanAI! 🚀**
.....

