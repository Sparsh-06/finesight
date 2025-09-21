# FineSight - AI-Powered Legal Document Analysis

🎯 **Demo Available for Judges**: [Try Demo Now](http://localhost:3000/auth/login?demo=true)

## Overview

FineSight is an AI-powered legal document analysis platform that helps users understand, analyze, and extract insights from legal documents. Built with cutting-edge AI technology, it provides comprehensive document analysis, risk assessment, and intelligent Q&A capabilities.

## 🚀 Quick Demo Access

**For Judges and Testers:**
- **Demo Email**: `demo@finesight.com`
- **Demo Password**: `demo123`
- **Quick Access**: Click any "Try Demo" button on the landing page

## ✨ Key Features

### 🔍 AI-Powered Document Analysis
- Upload PDF legal documents
- Automatic text extraction using Google Cloud Document AI
- Comprehensive legal analysis with Gemini AI
- Risk assessment and red flag detection

### 💬 Intelligent Document Chat
- Ask questions about your documents
- RAG (Retrieval-Augmented Generation) for accurate answers
- Context-aware responses based on document content
- Real-time chat interface

### 📊 Professional Dashboard
- Clean, modern interface
- Document management and organization
- Analysis results visualization
- Responsive design for all devices

### 🔐 Secure Authentication
- JWT-based authentication system
- Refresh token implementation
- Email verification
- Secure user management

## 🛠 Tech Stack

### Frontend
- **Next.js 15.5.2** with React 19
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Responsive design** optimized for mobile

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Google Cloud Document AI**
- **Qdrant** vector database for RAG
- **Gemini AI** for document analysis

## 🏗 Project Structure

```
├── backend/                 # Node.js/Express API
│   ├── controllers/        # API controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── middleware/        # Authentication & validation
├── frontendNew/           # Next.js frontend
│   ├── src/app/          # App router pages
│   ├── src/components/   # React components
│   ├── src/store/        # Zustand stores
│   └── src/util/         # Utilities
└── DEMO_ACCESS.md        # Demo instructions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Google Cloud Document AI API key
- Qdrant vector database

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Genhack
```

2. **Backend Setup**
```bash
cd backend
npm install
# Set up environment variables
cp .env.example .env
npm start
```

3. **Frontend Setup**
```bash
cd frontendNew
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLOUD_KEY_PATH=path_to_service_account_json
QDRANT_URL=your_qdrant_url
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🎯 Demo Features Showcase

### Document Analysis
- Upload legal documents (PDF format)
- Automatic text extraction and processing
- AI-powered legal analysis
- Risk assessment with red flags
- Key terms and clauses extraction

### Interactive Features
- Document chat with RAG technology
- Real-time question answering
- Document summaries
- Parties involved identification
- Payment terms analysis

### Professional UI/UX
- Modern, responsive design
- Mobile-optimized interface
- Smooth animations and transitions
- Professional color scheme
- Intuitive navigation

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/create-test-account` - Create demo account

### File Operations
- `POST /api/file/process` - Upload and analyze document
- `GET /api/file/user-files` - Get user's documents
- `GET /api/file/:id` - Get specific document
- `POST /api/file/rag-chat` - Chat with document

## 🎨 Design Philosophy

FineSight follows modern design principles:
- **Mobile-first responsive design**
- **Clean, professional interface**
- **Intuitive user experience**
- **Accessibility considerations**
- **Performance optimization**

## 🧪 Testing

The platform includes comprehensive demo functionality:
- Pre-created test account
- Sample documents for analysis
- Full feature demonstration
- Responsive design testing
- Cross-browser compatibility

## 📱 Mobile Responsiveness

FineSight is fully optimized for mobile devices:
- Responsive layouts for all screen sizes
- Touch-friendly interface elements
- Optimized text and button sizing
- Mobile navigation patterns
- Fast loading on mobile networks

## 🔒 Security Features

- JWT-based authentication
- Secure password hashing
- Email verification system
- API rate limiting
- Input validation and sanitization
- Secure file handling

## 🚀 Deployment

The application is designed for easy deployment:
- Docker support (coming soon)
- Environment-based configuration
- Production-ready error handling
- Scalable architecture
- Cloud-native design

## 📞 Support

For questions about the demo or technical details:
- Check `DEMO_ACCESS.md` for demo instructions
- Review the codebase for implementation details
- Test all features using the demo account

---

**Built with ❤️ for the GenHack Hackathon**

*Demonstrating the power of AI in legal document analysis*