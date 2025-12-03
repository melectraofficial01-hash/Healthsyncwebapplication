import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Stethoscope, MessageSquare, MapPin } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface Props {
  accessToken: string;
  onStartChat: (appointment: any) => void;
}

export function AppointmentsList({ accessToken, onStartChat }: Props) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-62259918/appointments`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No appointments scheduled yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Appointments
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    {appointment.doctorName ? (
                      <Stethoscope className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <User className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-gray-900">
                      {appointment.doctorName || appointment.patientName}
                    </h4>
                    {appointment.doctorSpecialization && (
                      <p className="text-indigo-600">{appointment.doctorSpecialization}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.timeSlot}</span>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => onStartChat(appointment)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-4"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
