import { useState } from 'react';
import { Heart, Calendar, MessageSquare, LogOut, Stethoscope } from 'lucide-react';
import { AppointmentsList } from './AppointmentsList';
import { Chat } from './Chat';

interface Props {
  profile: any;
  accessToken: string;
  onLogout: () => void;
}

export function DoctorDashboard({ profile, accessToken, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'chat'>('appointments');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

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
                <p className="text-gray-600">Dr. {profile.name}</p>
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
          <div className="flex gap-1">
            <button
              onClick={() => {
                setActiveTab('appointments');
                setSelectedAppointment(null);
              }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'appointments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Messages
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'appointments' && (
          <div>
            <div className="mb-6">
              <h2 className="text-gray-900">Patient Appointments</h2>
              <p className="text-gray-600">View and manage your patient appointments</p>
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
              <h2 className="text-gray-900">Patient Messages</h2>
              <p className="text-gray-600">Chat with your patients</p>
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
                  Select an appointment to start chatting with a patient
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
