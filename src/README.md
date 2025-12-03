# HealthSync – Smart Health Data Management Platform

A comprehensive web application for managing health data, medical reports, and patient-doctor interactions.

## 🚀 Features

### Patient Features
- **User Authentication** - Secure signup and login with Supabase Auth
- **Medical Report Upload** - Upload medical reports (images/PDFs)
- **OCR & Vitals Extraction** - Automatically extract vital signs from reports
- **Health Dashboard** - View all reports and health vitals in one place
- **Trend Charts** - Visualize health metrics over time (BP, sugar, heart rate)
- **Doctor Search** - Find doctors by specialization and city
- **Appointment Booking** - Book appointments with available time slots
- **Real-time Chat** - Communicate with doctors via live messaging

### Doctor Features
- **Patient Appointments** - View and manage patient appointments
- **Real-time Chat** - Communicate with patients
- **Patient Information** - Access appointment details and reasons for visit

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend-as-a-Service
  - Authentication
  - Database (Key-Value Store)
  - Storage (File uploads)
- **Hono** - Edge function web framework
- **Deno** - Server runtime

## 📋 Prerequisites

- Node.js 16+ (for local development)
- Supabase account
- Modern web browser

## 🚀 Deployment Instructions

### Option 1: Deploy to Vercel (Recommended)

1. **Fork or Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd healthsync
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - The application is already connected to Supabase
   - No additional configuration needed if using Figma Make

4. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```
   - Follow the prompts
   - Set the framework preset to "Vite"
   - Deploy!

### Option 2: Deploy to Netlify

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://www.netlify.com/)
   - Drag and drop the `dist` folder
   - Or connect your Git repository for automatic deployments

### Option 3: Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:5173`

## 👥 Demo Credentials

### Doctor Account
- **Email:** sarah.johnson@healthsync.com
- **Password:** demo123

### Patient Account
- Create a new account using the signup form
- Select "Patient" as the role

## 📊 Database Schema

The application uses Supabase's Key-Value store with the following structure:

```
user:{userId} - User profiles
doctor:{doctorId} - Doctor profiles
report:{reportId} - Medical report metadata
vitals:{userId}:{reportId} - Extracted vitals data
appointment:{appointmentId} - Appointment bookings
chat:{appointmentId}:{messageId} - Chat messages
```

## 🏥 Pre-seeded Doctors

The application comes with 8 pre-seeded doctors:
- **Dr. Sarah Johnson** - Cardiology, New York
- **Dr. Michael Chen** - Endocrinology, San Francisco
- **Dr. Emily Rodriguez** - General Medicine, New York
- **Dr. James Wilson** - Cardiology, Los Angeles
- **Dr. Priya Patel** - Endocrinology, New York
- **Dr. Robert Thompson** - Neurology, Chicago
- **Dr. Lisa Anderson** - General Medicine, San Francisco
- **Dr. David Kim** - Orthopedics, Los Angeles

## 🔒 Security & Privacy

**⚠️ IMPORTANT DISCLAIMER**

This is a **PROTOTYPE/DEMO APPLICATION** and is **NOT HIPAA-COMPLIANT**. 

**DO NOT use for:**
- Real patient data
- Production healthcare systems
- Storing actual medical records
- Any regulated healthcare environment

**For demonstration purposes only.**

### For Production Use, Implement:
- End-to-end encryption
- HIPAA-compliant infrastructure
- Comprehensive audit logging
- Data privacy compliance (GDPR, HIPAA, etc.)
- Professional security audit
- Secure backups and disaster recovery
- Access controls and role-based permissions

## 🎯 Key Features Explained

### 1. OCR Processing (Simulated)
The backend simulates OCR processing by generating sample medical report text. In production, integrate with:
- Google Cloud Vision API
- AWS Textract
- Azure Computer Vision
- Tesseract.js

### 2. Vitals Extraction
Uses regex patterns to extract:
- Blood Pressure (systolic/diastolic)
- Blood Sugar
- Heart Rate
- Temperature
- Weight
- Cholesterol
- HbA1c

### 3. Real-time Chat
Uses polling (3-second intervals) to simulate real-time messaging. For production:
- Implement Supabase Realtime subscriptions
- Use WebSockets for instant messaging
- Add typing indicators and read receipts

### 4. File Storage
Medical reports are stored in Supabase Storage with:
- Private bucket access
- Signed URLs (24-hour expiry)
- Support for images and PDFs

## 🐛 Known Limitations

1. **OCR is simulated** - No actual text extraction from images
2. **Chat uses polling** - Not true real-time WebSocket
3. **No image processing** - Reports stored but not analyzed
4. **Basic validation** - Limited input validation
5. **Not production-ready** - Security and compliance needed

## 🔧 Environment Variables

When deploying outside Figma Make, set these variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🤝 Contributing

This is a prototype application. For production use:

1. Implement proper OCR integration
2. Add comprehensive error handling
3. Implement proper logging and monitoring
4. Add comprehensive tests
5. Implement proper security measures
6. Add data backup and recovery
7. Implement rate limiting
8. Add proper validation and sanitization

## 📄 License

MIT License - Feel free to use for educational purposes.

## 🙋 Support

For issues or questions:
- Check the console for error messages
- Review the network tab for failed API calls
- Ensure Supabase credentials are correct

## 🎓 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

---

**Remember: This is a DEMO APPLICATION. Do not use for real medical data or production healthcare systems.**
