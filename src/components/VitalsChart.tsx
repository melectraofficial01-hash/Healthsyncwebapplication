import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface Props {
  accessToken: string;
}

export function VitalsChart({ accessToken }: Props) {
  const [vitalsData, setVitalsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'bloodPressure' | 'bloodSugar' | 'heartRate'>('bloodPressure');

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-62259918/vitals/trends`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVitalsData(data.vitals);
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading vitals...</p>
      </div>
    );
  }

  if (vitalsData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No vitals data yet. Upload a report to see trends.</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = vitalsData.map((v) => ({
    date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    systolic: v.systolic,
    diastolic: v.diastolic,
    bloodSugar: v.bloodSugar,
    heartRate: v.heartRate
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Vitals Trends
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMetric('bloodPressure')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedMetric === 'bloodPressure'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setSelectedMetric('bloodSugar')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedMetric === 'bloodSugar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Blood Sugar
            </button>
            <button
              onClick={() => setSelectedMetric('heartRate')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedMetric === 'heartRate'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Heart Rate
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            
            {selectedMetric === 'bloodPressure' && (
              <>
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Systolic"
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Diastolic"
                />
              </>
            )}

            {selectedMetric === 'bloodSugar' && (
              <Line
                type="monotone"
                dataKey="bloodSugar"
                stroke="#10b981"
                strokeWidth={2}
                name="Blood Sugar (mg/dL)"
              />
            )}

            {selectedMetric === 'heartRate' && (
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#ef4444"
                strokeWidth={2}
                name="Heart Rate (bpm)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {selectedMetric === 'bloodPressure' && (
            <>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-900">Latest BP</p>
                <p className="text-blue-700">
                  {chartData[chartData.length - 1]?.systolic}/
                  {chartData[chartData.length - 1]?.diastolic}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-900">Avg Systolic</p>
                <p className="text-blue-700">
                  {Math.round(
                    chartData.reduce((acc, d) => acc + (d.systolic || 0), 0) / chartData.length
                  )}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-900">Avg Diastolic</p>
                <p className="text-blue-700">
                  {Math.round(
                    chartData.reduce((acc, d) => acc + (d.diastolic || 0), 0) / chartData.length
                  )}
                </p>
              </div>
            </>
          )}

          {selectedMetric === 'bloodSugar' && (
            <>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-900">Latest</p>
                <p className="text-green-700">
                  {chartData[chartData.length - 1]?.bloodSugar} mg/dL
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-900">Average</p>
                <p className="text-green-700">
                  {Math.round(
                    chartData.reduce((acc, d) => acc + (d.bloodSugar || 0), 0) / chartData.length
                  )} mg/dL
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-900">Status</p>
                <p className="text-green-700">
                  {chartData[chartData.length - 1]?.bloodSugar > 100 ? 'Monitor' : 'Normal'}
                </p>
              </div>
            </>
          )}

          {selectedMetric === 'heartRate' && (
            <>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-900">Latest</p>
                <p className="text-red-700">
                  {chartData[chartData.length - 1]?.heartRate} bpm
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-900">Average</p>
                <p className="text-red-700">
                  {Math.round(
                    chartData.reduce((acc, d) => acc + (d.heartRate || 0), 0) / chartData.length
                  )} bpm
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-900">Status</p>
                <p className="text-red-700">Normal Range</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
