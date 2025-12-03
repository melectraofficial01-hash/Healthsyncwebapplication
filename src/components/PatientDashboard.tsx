import { useState } from 'react';
import { Heart, Upload, Activity, Calendar, MessageSquare, LogOut, TrendingUp } from 'lucide-react';
import { ReportUpload } from './ReportUpload';
import { ReportsList } from './ReportsList';
import { VitalsChart } from './VitalsChart';
import { DoctorSearch } from './DoctorSearch';
import { AppointmentsList } from './AppointmentsList';
import { Chat } from './Chat';

interface Props {
  profile: any;
  accessToken: string;
  onLogout: () => void;
}

export function PatientDashboard({ profile, accessToken, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'doctors' | 'appointments' | 'chat'>('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'reports', label: 'Reports', icon: Upload },
    { id: 'doctors', label: 'Find Doctors', icon: Heart },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'chat', label: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">HealthSync</h1>
                <p className="text-gray-600">Welcome, {profile.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id !== 'chat') setSelectedAppointment(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-900">Health Dashboard</h2>
                <p className="text-gray-600">Track your health vitals and medical reports</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VitalsChart accessToken={accessToken} />
              </div>
              <div>
                <ReportUpload accessToken={accessToken} onUploadSuccess={() => {}} />
              </div>
            </div>

            <ReportsList accessToken={accessToken} />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-900">Medical Reports</h2>
                <p className="text-gray-600">Upload and manage your medical reports</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ReportsList accessToken={accessToken} />
              </div>
              <div>
                <ReportUpload accessToken={accessToken} onUploadSuccess={() => {}} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div>
            <div className="mb-6">
              <h2 className="text-gray-900">Find Doctors</h2>
              <p className="text-gray-600">Search and book appointments with specialists</p>
            </div>
            <DoctorSearch accessToken={accessToken} />
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <div className="mb-6">
              <h2 className="text-gray-900">My Appointments</h2>
              <p className="text-gray-600">View and manage your appointments</p>
            </div>
            <AppointmentsList
              accessToken={accessToken}
              onStartChat={(appointment) => {
                setSelectedAppointment(appointment);
                setActiveTab('chat');
              }}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <div className="mb-6">
              <h2 className="text-gray-900">Messages</h2>
              <p className="text-gray-600">Chat with your doctors</p>
            </div>
            {selectedAppointment ? (
              <Chat
                appointment={selectedAppointment}
                accessToken={accessToken}
                currentUserId={profile.id}
                onBack={() => setSelectedAppointment(null)}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Select an appointment from the Appointments tab to start chatting
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
