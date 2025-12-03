# HealthSync - Quick Start Guide

Get up and running with HealthSync in 5 minutes!

## 🚀 Immediate Usage (No Setup Required)

The application is already deployed and ready to use. Simply access it through your browser!

---

## 👤 Step 1: Choose Your Role

### Option A: Test as a Doctor
Use the pre-configured demo account:

**Email:** `sarah.johnson@healthsync.com`  
**Password:** `demo123`

**What you can do:**
- View patient appointments
- Chat with patients
- See appointment details

### Option B: Test as a Patient
Create your own patient account:

1. Click "Sign Up" on the login page
2. Enter your details:
   - Full name
   - Email address
   - Password (min 6 characters)
   - Select "Patient" role
3. Click "Create Account"

**What you can do:**
- Upload medical reports
- View health vitals and trends
- Search and book doctors
- Chat with doctors

---

## 📋 Step 2: Patient Workflow

### Upload Your First Report

1. **Navigate to Dashboard**
   - After login, you'll see the main dashboard

2. **Upload a Report**
   - Look for the "Upload Medical Report" card
   - Select report type (e.g., "Blood Test")
   - Choose a file (image or PDF)
   - Click "Upload & Extract Vitals"

3. **View Results**
   - Report appears in the list
   - Vitals are automatically extracted (demo data)
   - Charts update with new data

### Book an Appointment

1. **Find a Doctor**
   - Click "Find Doctors" tab
   - Use filters:
     - Specialization (Cardiology, Endocrinology, etc.)
     - City (New York, San Francisco, etc.)
   - Or search by name

2. **Book Appointment**
   - Click "Book Appointment" on a doctor's card
   - Select date (future date)
   - Choose time slot
   - Enter reason for visit
   - Click "Confirm Booking"

3. **Confirmation**
   - Success message appears
   - View in "Appointments" tab

### Chat with Doctor

1. **Access Chat**
   - Go to "Appointments" tab
   - Click "Chat" button on any appointment

2. **Send Message**
   - Type your message in the text box
   - Press Enter or click Send button
   - Messages update every 3 seconds

---

## 🏥 Step 3: Doctor Workflow

### View Appointments

1. **Login as Doctor**
   - Use demo credentials or create doctor account

2. **View Appointments Tab**
   - See all patient appointments
   - View patient names and reasons

### Chat with Patients

1. **Select Appointment**
   - Click "Chat" on any appointment

2. **Respond to Patient**
   - Type medical advice or responses
   - Chat updates in real-time (3-second polling)

---

## 🎯 Common Use Cases

### Scenario 1: Regular Health Checkup

```
Patient Actions:
1. Upload latest blood test report
2. View vitals trends (BP, sugar levels)
3. Search for General Medicine doctor
4. Book appointment for next week
5. Chat with doctor about results
```

### Scenario 2: Monitoring Chronic Condition

```
Patient Actions:
1. Upload multiple reports over time
2. View trend charts (blood sugar, BP)
3. Track improvements or concerns
4. Book follow-up with specialist
5. Discuss trends with doctor via chat
```

### Scenario 3: Second Opinion

```
Patient Actions:
1. Upload existing medical reports
2. Search specialist by field
3. Book consultation
4. Share concerns via chat
5. Receive medical advice
```

---

## 💡 Tips & Tricks

### For Patients

1. **Upload Regularly**
   - More reports = better trend analysis
   - Upload different report types

2. **Use Filters**
   - Search doctors by specialty AND city
   - Narrow down options quickly

3. **Be Specific**
   - Provide detailed reason when booking
   - Helps doctor prepare

4. **Check Charts**
   - Switch between BP, Sugar, Heart Rate
   - Monitor trends over time

### For Doctors

1. **Review Patient History**
   - Check appointment reason before chat
   - Prepare relevant questions

2. **Respond Promptly**
   - Patients expect timely responses
   - Use chat for quick consultations

---

## 📱 Features Overview

### Patient Features
✅ Medical report upload (PDF/images)  
✅ Automatic vitals extraction  
✅ Health trends visualization  
✅ Doctor search and filtering  
✅ Appointment booking  
✅ Real-time chat  

### Doctor Features
✅ Patient appointment management  
✅ Real-time chat with patients  
✅ View appointment details  

---

## 🔍 Understanding the Interface

### Dashboard Tab (Patients Only)
- **Health Trends Chart** - Visualize vitals over time
- **Upload Card** - Quick upload access
- **Recent Reports** - Latest medical reports

### Reports Tab (Patients Only)
- **Upload Section** - Upload new reports
- **Reports List** - All uploaded reports
- **Vitals View** - Click report to see extracted vitals

### Find Doctors Tab (Patients Only)
- **Search Bar** - Search by name or specialty
- **Filters** - Specialty and city dropdowns
- **Doctor Cards** - Profile info and booking

### Appointments Tab
- **List View** - All appointments
- **Status Badges** - Confirmed, pending, cancelled
- **Chat Access** - Quick chat button

### Messages Tab
- **Active Chats** - Select appointment to chat
- **Message History** - All conversation history
- **Send Messages** - Text input with send button

---

## ⚠️ Important Notes

### Demo Limitations

1. **OCR is Simulated**
   - Not extracting actual text from images
   - Vitals are randomly generated
   - For demonstration purposes only

2. **Chat Polling**
   - Updates every 3 seconds
   - Not instant real-time
   - May have slight delays

3. **File URLs Expire**
   - Signed URLs valid for 24 hours
   - Refresh page to get new URLs

### Security Warning

🚨 **DO NOT USE FOR REAL MEDICAL DATA**

This is a **DEMO APPLICATION**:
- Not HIPAA compliant
- Not for production use
- For demonstration only
- No real data security

---

## 🆘 Need Help?

### Quick Fixes

**Can't login?**
→ Use demo doctor account or create new patient account

**Upload not working?**
→ Check file type (image/PDF) and size (<10MB)

**No vitals showing?**
→ Upload a report first, then check Dashboard

**Doctor search empty?**
→ Select "All Specializations" and "All Cities"

**Chat not updating?**
→ Wait 3 seconds for polling to update

### Get More Help

📖 Read the full [README.md](./README.md)  
🔧 Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)  
📚 Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🎉 Next Steps

Once you're comfortable with the basics:

1. **Explore All Features**
   - Upload multiple report types
   - Book different doctors
   - Test chat functionality

2. **Try Different Scenarios**
   - Patient and doctor workflows
   - Multiple appointments
   - Long-term health tracking

3. **Understand the Code**
   - Review component structure
   - Check API endpoints
   - Learn backend architecture

4. **Customize for Your Needs**
   - Modify UI components
   - Add new features
   - Integrate real OCR

---

## 📊 Sample Data

### Pre-seeded Doctors

| Name | Specialization | City |
|------|---------------|------|
| Dr. Sarah Johnson | Cardiology | New York |
| Dr. Michael Chen | Endocrinology | San Francisco |
| Dr. Emily Rodriguez | General Medicine | New York |
| Dr. James Wilson | Cardiology | Los Angeles |
| Dr. Priya Patel | Endocrinology | New York |
| Dr. Robert Thompson | Neurology | Chicago |
| Dr. Lisa Anderson | General Medicine | San Francisco |
| Dr. David Kim | Orthopedics | Los Angeles |

### Sample Vitals Generated

- Blood Pressure: 110-140 / 70-90 mmHg
- Blood Sugar: 80-120 mg/dL
- Heart Rate: 60-100 bpm
- Temperature: 97-99°F
- Weight: 120-200 lbs
- Cholesterol: 150-240 mg/dL
- HbA1c: 4.5-6.5%

---

**Ready to get started?** Login and start exploring HealthSync! 🚀

For detailed documentation, see [README.md](./README.md)
