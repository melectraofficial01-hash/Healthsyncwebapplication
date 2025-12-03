# HealthSync API Documentation

## Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-62259918
```

## Authentication

All endpoints (except signup) require authentication via Bearer token:

```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

Get access token via Supabase Auth:
```javascript
const { data: { session } } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
const accessToken = session.access_token;
```

---

## 🔐 Authentication Endpoints

### Sign Up
Create a new user account.

**POST** `/signup`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "patient"  // or "doctor"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "patient@example.com",
    ...
  }
}
```

**Error Response:**
```json
{
  "error": "User already exists"
}
```

---

### Get Profile
Retrieve current user's profile.

**GET** `/profile`

**Headers:**
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "email": "patient@example.com",
    "name": "John Doe",
    "role": "patient",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📄 Reports & Vitals Endpoints

### Upload Report
Upload a medical report file.

**POST** `/reports/upload`

**Headers:**
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Request Body:** `multipart/form-data`
- `file`: File (image or PDF)
- `reportType`: string (e.g., "Blood Test", "ECG Report")

**Response:**
```json
{
  "success": true,
  "report": {
    "id": "report_1234567890",
    "userId": "uuid",
    "fileName": "report.pdf",
    "fileType": "application/pdf",
    "filePath": "userId/timestamp_report.pdf",
    "reportType": "Blood Test",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "ocrText": "MEDICAL REPORT...",
    "vitals": {
      "bloodPressure": "120/80",
      "systolic": 120,
      "diastolic": 80,
      "bloodSugar": 95,
      "heartRate": 72
    },
    "fileUrl": "https://..."
  }
}
```

---

### Get Reports
Retrieve all reports for current user.

**GET** `/reports`

**Headers:**
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response:**
```json
{
  "reports": [
    {
      "id": "report_1234567890",
      "fileName": "report.pdf",
      "reportType": "Blood Test",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "vitals": {...},
      "fileUrl": "https://..."
    }
  ]
}
```

---

### Get Vitals Trends
Retrieve trend data for health vitals.

**GET** `/vitals/trends`

**Headers:**
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response:**
```json
{
  "vitals": [
    {
      "reportId": "report_1234567890",
      "userId": "uuid",
      "date": "2024-01-01T00:00:00.000Z",
      "systolic": 120,
      "diastolic": 80,
      "bloodSugar": 95,
      "heartRate": 72,
      "temperature": 98.6,
      "weight": 165,
      "cholesterol": 180,
      "hba1c": 5.5
    }
  ]
}
```

---

## 👨‍⚕️ Doctors Endpoints

### Search Doctors
Search for doctors by specialization and city.

**GET** `/doctors/search?specialization={spec}&city={city}`

**Headers:**
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Query Parameters:**
- `specialization` (optional): Filter by specialization
- `city` (optional): Filter by city

**Response:**
```json
{
  "doctors": [
    {
      "id": "doc1",
      "name": "Dr. Sarah Johnson",
      "specialization": "Cardiology",
      "city": "New York",
      "email": "sarah.johnson@healthsync.com",
      "experience": "15 years",
      "qualifications": "MD, FACC",
      "availableSlots": ["9:00 AM", "10:00 AM", "11:00 AM"]
    }
  ]
}
```

---

### Get Filters
Get available specializations and cities.

**GET** `/doctors/filters`

**Headers:**
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response:**
```json
{
  "specializations": [
    "Cardiology",
    "Endocrinology",
    "General Medicine",
    "Neurology",
    "Orthopedics"
  ],
  "cities": [
    "New York",
    "San Francisco",
    "Los Angeles",
    "Chicago"
  ]
}
```

---

## 📅 Appointments Endpoints

### Book Appointment
Book an appointment with a doctor.

**POST** `/appointments/book`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {accessToken}"
}
```

**Request Body:**
```json
{
  "doctorId": "doc1",
  "date": "2024-01-15",
  "timeSlot": "10:00 AM",
  "reason": "Regular checkup"
}
```

**Response:**
```json
{
  "success": true,
  "appointment": {
    "id": "appt_1234567890",
    "patientId": "uuid",
    "doctorId": "doc1",
    "date": "2024-01-15",
    "timeSlot": "10:00 AM",
    "reason": "Regular checkup",
    "status": "confirmed",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Appointments
Retrieve appointments for current user.

**GET** `/appointments`

**Headers:**
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response:**
```json
{
  "appointments": [
    {
      "id": "appt_1234567890",
      "patientId": "uuid",
      "doctorId": "doc1",
      "date": "2024-01-15",
      "timeSlot": "10:00 AM",
      "reason": "Regular checkup",
      "status": "confirmed",
      "doctorName": "Dr. Sarah Johnson",
      "doctorSpecialization": "Cardiology",
      "patientName": "John Doe"
    }
  ]
}
```

**Note:** Returns different data based on user role:
- Patients see their appointments with doctor info
- Doctors see their patient appointments with patient info

---

## 💬 Chat Endpoints

### Send Message
Send a chat message for an appointment.

**POST** `/chat/send`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {accessToken}"
}
```

**Request Body:**
```json
{
  "appointmentId": "appt_1234567890",
  "message": "Hello, I have a question about my medication."
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg_1234567890_abc123",
    "appointmentId": "appt_1234567890",
    "senderId": "uuid",
    "message": "Hello, I have a question about my medication.",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Chat Messages
Retrieve all messages for an appointment.

**GET** `/chat/{appointmentId}`

**Headers:**
```json
{
  "Authorization": "Bearer {accessToken}"
}
```

**Response:**
```json
{
  "messages": [
    {
      "id": "msg_1234567890_abc123",
      "appointmentId": "appt_1234567890",
      "senderId": "uuid",
      "message": "Hello, I have a question.",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "senderName": "John Doe",
      "senderRole": "patient"
    }
  ]
}
```

---

## 🔧 Data Structures

### User Profile
```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  createdAt: string;
}
```

### Doctor
```typescript
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  city: string;
  email: string;
  experience: string;
  qualifications: string;
  availableSlots: string[];
}
```

### Report
```typescript
interface Report {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  filePath: string;
  reportType: string;
  uploadedAt: string;
  ocrText: string;
  vitals: Vitals;
  fileUrl?: string;
}
```

### Vitals
```typescript
interface Vitals {
  bloodPressure?: string;
  systolic?: number;
  diastolic?: number;
  bloodSugar?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  cholesterol?: number;
  hba1c?: number;
}
```

### Appointment
```typescript
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  doctorName?: string;
  doctorSpecialization?: string;
  patientName?: string;
}
```

### Chat Message
```typescript
interface ChatMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  message: string;
  timestamp: string;
  senderName?: string;
  senderRole?: 'patient' | 'doctor';
}
```

---

## 🚨 Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 500 Internal Server Error
```json
{
  "error": "Detailed error message"
}
```

---

## 📝 Example Usage

### Complete Flow Example

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. Sign up
const signupResponse = await fetch(`${baseUrl}/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseAnonKey}`
  },
  body: JSON.stringify({
    email: 'patient@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'patient'
  })
});

// 2. Login
const { data: { session } } = await supabase.auth.signInWithPassword({
  email: 'patient@example.com',
  password: 'password123'
});
const accessToken = session.access_token;

// 3. Upload report
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('reportType', 'Blood Test');

const uploadResponse = await fetch(`${baseUrl}/reports/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

// 4. Get vitals trends
const trendsResponse = await fetch(`${baseUrl}/vitals/trends`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// 5. Search doctors
const doctorsResponse = await fetch(
  `${baseUrl}/doctors/search?specialization=Cardiology&city=New York`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

// 6. Book appointment
const bookingResponse = await fetch(`${baseUrl}/appointments/book`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    doctorId: 'doc1',
    date: '2024-01-15',
    timeSlot: '10:00 AM',
    reason: 'Regular checkup'
  })
});

// 7. Send chat message
const chatResponse = await fetch(`${baseUrl}/chat/send`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    appointmentId: 'appt_1234567890',
    message: 'Hello doctor!'
  })
});
```

---

## 🔒 Security Notes

1. **Never expose service role key** on the frontend
2. **Always use HTTPS** in production
3. **Validate all inputs** on the server
4. **Implement rate limiting** for production
5. **Use signed URLs** for file access (expire after 24h)
6. **Store sensitive data encrypted**

---

## 📊 Rate Limits

Current implementation has no rate limits. For production:
- Implement per-user rate limiting
- Limit file upload size (10MB recommended)
- Limit chat message frequency
- Monitor API usage

---

## 🧪 Testing

### Test with cURL

```bash
# Get doctors
curl -X GET \
  'https://{projectId}.supabase.co/functions/v1/make-server-62259918/doctors/search' \
  -H 'Authorization: Bearer {accessToken}'

# Search with filters
curl -X GET \
  'https://{projectId}.supabase.co/functions/v1/make-server-62259918/doctors/search?specialization=Cardiology&city=New York' \
  -H 'Authorization: Bearer {accessToken}'
```

### Test with Postman

1. Import the API endpoints
2. Set environment variable for `accessToken`
3. Set environment variable for `projectId`
4. Use bearer token authentication

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Hono Framework](https://hono.dev/)
- [Deno Deploy](https://deno.com/deploy)

---

**Note:** This is a demo API. For production use, implement proper validation, error handling, and security measures.
