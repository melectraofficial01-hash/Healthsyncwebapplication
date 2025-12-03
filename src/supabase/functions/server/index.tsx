import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { extractVitalsFromText } from './vitals.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize storage buckets
async function initStorage() {
  const bucketName = 'make-62259918-medical-reports';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log('Created medical reports bucket');
  }
}

initStorage();

// Seed initial doctors data
async function seedDoctors() {
  const existingDoctors = await kv.getByPrefix('doctor:');
  if (existingDoctors.length === 0) {
    const doctors = [
      {
        id: 'doc1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        city: 'New York',
        email: 'sarah.johnson@healthsync.com',
        experience: '15 years',
        qualifications: 'MD, FACC',
        availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
      },
      {
        id: 'doc2',
        name: 'Dr. Michael Chen',
        specialization: 'Endocrinology',
        city: 'San Francisco',
        email: 'michael.chen@healthsync.com',
        experience: '12 years',
        qualifications: 'MD, FACE',
        availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
      },
      {
        id: 'doc3',
        name: 'Dr. Emily Rodriguez',
        specialization: 'General Medicine',
        city: 'New York',
        email: 'emily.rodriguez@healthsync.com',
        experience: '10 years',
        qualifications: 'MD, ABIM',
        availableSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '1:00 PM', '2:00 PM', '3:00 PM']
      },
      {
        id: 'doc4',
        name: 'Dr. James Wilson',
        specialization: 'Cardiology',
        city: 'Los Angeles',
        email: 'james.wilson@healthsync.com',
        experience: '20 years',
        qualifications: 'MD, PhD, FACC',
        availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
      },
      {
        id: 'doc5',
        name: 'Dr. Priya Patel',
        specialization: 'Endocrinology',
        city: 'New York',
        email: 'priya.patel@healthsync.com',
        experience: '8 years',
        qualifications: 'MD, FACE',
        availableSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
      },
      {
        id: 'doc6',
        name: 'Dr. Robert Thompson',
        specialization: 'Neurology',
        city: 'Chicago',
        email: 'robert.thompson@healthsync.com',
        experience: '18 years',
        qualifications: 'MD, FAAN',
        availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
      },
      {
        id: 'doc7',
        name: 'Dr. Lisa Anderson',
        specialization: 'General Medicine',
        city: 'San Francisco',
        email: 'lisa.anderson@healthsync.com',
        experience: '14 years',
        qualifications: 'MD, FACP',
        availableSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '1:00 PM', '2:00 PM', '3:00 PM']
      },
      {
        id: 'doc8',
        name: 'Dr. David Kim',
        specialization: 'Orthopedics',
        city: 'Los Angeles',
        email: 'david.kim@healthsync.com',
        experience: '16 years',
        qualifications: 'MD, FAAOS',
        availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
      }
    ];

    for (const doctor of doctors) {
      await kv.set(`doctor:${doctor.id}`, doctor);
      await kv.set(`user:${doctor.email}`, {
        id: doctor.id,
        email: doctor.email,
        name: doctor.name,
        role: 'doctor'
      });
    }
    console.log('Seeded doctors data');
  }
}

seedDoctors();

// Helper to get authenticated user
async function getAuthenticatedUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  return user;
}

// ==================== AUTH ROUTES ====================

// Sign up
app.post('/make-server-62259918/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: role || 'patient' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role: role || 'patient',
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user profile
app.get('/make-server-62259918/profile', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    return c.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== REPORTS & VITALS ROUTES ====================

// Upload report
app.post('/make-server-62259918/reports/upload', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const reportType = formData.get('reportType') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const bucketName = 'make-62259918-medical-reports';

    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: uploadError.message }, 400);
    }

    // Simulate OCR processing
    const ocrText = await simulateOCR(file.type);

    // Extract vitals
    const vitals = extractVitalsFromText(ocrText);

    // Create report record
    const reportId = `report_${Date.now()}`;
    const report = {
      id: reportId,
      userId: user.id,
      fileName: file.name,
      fileType: file.type,
      filePath: fileName,
      reportType: reportType || 'General',
      uploadedAt: new Date().toISOString(),
      ocrText,
      vitals
    };

    await kv.set(`report:${reportId}`, report);

    // Store vitals separately for trend analysis
    if (vitals && Object.keys(vitals).length > 0) {
      const vitalRecord = {
        reportId,
        userId: user.id,
        date: new Date().toISOString(),
        ...vitals
      };
      await kv.set(`vitals:${user.id}:${reportId}`, vitalRecord);
    }

    // Get signed URL for the file
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24); // 24 hours

    return c.json({
      success: true,
      report: {
        ...report,
        fileUrl: signedUrlData?.signedUrl
      }
    });
  } catch (error) {
    console.error('Error uploading report:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user's reports
app.get('/make-server-62259918/reports', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allReports = await kv.getByPrefix('report:');
    const userReports = allReports
      .filter((r: any) => r.userId === user.id)
      .sort((a: any, b: any) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

    // Get signed URLs for all reports
    const bucketName = 'make-62259918-medical-reports';
    const reportsWithUrls = await Promise.all(
      userReports.map(async (report: any) => {
        const { data: signedUrlData } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(report.filePath, 60 * 60 * 24);
        return {
          ...report,
          fileUrl: signedUrlData?.signedUrl
        };
      })
    );

    return c.json({ reports: reportsWithUrls });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get vitals trend data
app.get('/make-server-62259918/vitals/trends', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allVitals = await kv.getByPrefix(`vitals:${user.id}:`);
    const sortedVitals = allVitals.sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return c.json({ vitals: sortedVitals });
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== DOCTORS ROUTES ====================

// Search doctors
app.get('/make-server-62259918/doctors/search', async (c) => {
  try {
    const specialization = c.req.query('specialization');
    const city = c.req.query('city');

    let doctors = await kv.getByPrefix('doctor:');

    if (specialization && specialization !== 'All') {
      doctors = doctors.filter((d: any) => d.specialization === specialization);
    }

    if (city && city !== 'All') {
      doctors = doctors.filter((d: any) => d.city === city);
    }

    return c.json({ doctors });
  } catch (error) {
    console.error('Error searching doctors:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all specializations and cities
app.get('/make-server-62259918/doctors/filters', async (c) => {
  try {
    const doctors = await kv.getByPrefix('doctor:');
    const specializations = [...new Set(doctors.map((d: any) => d.specialization))];
    const cities = [...new Set(doctors.map((d: any) => d.city))];

    return c.json({ specializations, cities });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== APPOINTMENTS ROUTES ====================

// Book appointment
app.post('/make-server-62259918/appointments/book', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { doctorId, date, timeSlot, reason } = await c.req.json();

    const appointmentId = `appt_${Date.now()}`;
    const appointment = {
      id: appointmentId,
      patientId: user.id,
      doctorId,
      date,
      timeSlot,
      reason,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    await kv.set(`appointment:${appointmentId}`, appointment);
    await kv.set(`appointment:patient:${user.id}:${appointmentId}`, appointment);
    await kv.set(`appointment:doctor:${doctorId}:${appointmentId}`, appointment);

    return c.json({ success: true, appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user's appointments
app.get('/make-server-62259918/appointments', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    const role = userProfile?.role || 'patient';

    const prefix = role === 'doctor' 
      ? `appointment:doctor:${user.id}:` 
      : `appointment:patient:${user.id}:`;

    let appointments = await kv.getByPrefix(prefix);

    // Enrich with doctor/patient info
    const enriched = await Promise.all(
      appointments.map(async (appt: any) => {
        const doctor = await kv.get(`doctor:${appt.doctorId}`);
        const patient = await kv.get(`user:${appt.patientId}`);
        return {
          ...appt,
          doctorName: doctor?.name,
          doctorSpecialization: doctor?.specialization,
          patientName: patient?.name
        };
      })
    );

    return c.json({ appointments: enriched });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== CHAT ROUTES ====================

// Send message
app.post('/make-server-62259918/chat/send', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { appointmentId, message } = await c.req.json();

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const chatMessage = {
      id: messageId,
      appointmentId,
      senderId: user.id,
      message,
      timestamp: new Date().toISOString()
    };

    await kv.set(`chat:${appointmentId}:${messageId}`, chatMessage);

    return c.json({ success: true, message: chatMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get chat messages
app.get('/make-server-62259918/chat/:appointmentId', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const appointmentId = c.req.param('appointmentId');
    const messages = await kv.getByPrefix(`chat:${appointmentId}:`);
    
    const sortedMessages = messages.sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Enrich with sender info
    const enriched = await Promise.all(
      sortedMessages.map(async (msg: any) => {
        const sender = await kv.get(`user:${msg.senderId}`);
        return {
          ...msg,
          senderName: sender?.name || 'Unknown',
          senderRole: sender?.role || 'patient'
        };
      })
    );

    return c.json({ messages: enriched });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== HELPER FUNCTIONS ====================

async function simulateOCR(fileType: string): Promise<string> {
  // Simulate OCR processing with sample medical report text
  const sampleTexts = [
    `
    MEDICAL REPORT
    Patient: John Doe
    Date: ${new Date().toLocaleDateString()}
    
    VITAL SIGNS:
    Blood Pressure: 128/82 mmHg
    Blood Sugar (Fasting): 98 mg/dL
    Heart Rate: 72 bpm
    Temperature: 98.6°F
    Weight: 165 lbs
    
    LABORATORY RESULTS:
    Cholesterol: 185 mg/dL
    HDL: 52 mg/dL
    LDL: 110 mg/dL
    
    DIAGNOSIS: Patient shows normal vital signs with slightly elevated BP.
    Recommend lifestyle modifications and follow-up in 3 months.
    `,
    `
    BLOOD TEST RESULTS
    Patient Name: Jane Smith
    Test Date: ${new Date().toLocaleDateString()}
    
    GLUCOSE PROFILE:
    Fasting Blood Sugar: 112 mg/dL
    HbA1c: 5.8%
    
    CARDIOVASCULAR:
    Blood Pressure: 135/88 mmHg
    Total Cholesterol: 220 mg/dL
    Triglycerides: 155 mg/dL
    
    Heart Rate: 78 bpm
    
    NOTES: Pre-diabetic range. Recommend dietary changes and exercise.
    `,
    `
    HEALTH CHECKUP REPORT
    Date: ${new Date().toLocaleDateString()}
    
    VITALS:
    BP: 118/75 mmHg
    Pulse: 68 bpm
    Blood Sugar (Random): 105 mg/dL
    Temperature: 98.2°F
    
    BMI: 23.5 (Normal)
    
    All parameters within normal range.
    Patient is healthy. Annual checkup recommended.
    `
  ];

  return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
}

console.log('HealthSync server started');

Deno.serve(app.fetch);
