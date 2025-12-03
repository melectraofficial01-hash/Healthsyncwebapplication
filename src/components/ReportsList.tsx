import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Activity } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface Props {
  accessToken: string;
}

export function ReportsList({ accessToken }: Props) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-62259918/reports`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No reports uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Medical Reports
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-gray-900">{report.fileName}</h4>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
                    {report.reportType}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.uploadedAt).toLocaleDateString()}
                  </span>
                  {report.vitals && Object.keys(report.vitals).length > 0 && (
                    <span className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      {Object.keys(report.vitals).length} vitals extracted
                    </span>
                  )}
                </div>
              </div>

              {report.fileUrl && (
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  View
                </a>
              )}
            </div>

            {selectedReport?.id === report.id && report.vitals && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="text-gray-900 mb-3">Extracted Vitals</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {report.vitals.bloodPressure && (
                    <div>
                      <p className="text-gray-600">Blood Pressure</p>
                      <p className="text-gray-900">{report.vitals.bloodPressure}</p>
                    </div>
                  )}
                  {report.vitals.bloodSugar && (
                    <div>
                      <p className="text-gray-600">Blood Sugar</p>
                      <p className="text-gray-900">{report.vitals.bloodSugar} mg/dL</p>
                    </div>
                  )}
                  {report.vitals.heartRate && (
                    <div>
                      <p className="text-gray-600">Heart Rate</p>
                      <p className="text-gray-900">{report.vitals.heartRate} bpm</p>
                    </div>
                  )}
                  {report.vitals.temperature && (
                    <div>
                      <p className="text-gray-600">Temperature</p>
                      <p className="text-gray-900">{report.vitals.temperature}°F</p>
                    </div>
                  )}
                  {report.vitals.weight && (
                    <div>
                      <p className="text-gray-600">Weight</p>
                      <p className="text-gray-900">{report.vitals.weight} lbs</p>
                    </div>
                  )}
                  {report.vitals.cholesterol && (
                    <div>
                      <p className="text-gray-600">Cholesterol</p>
                      <p className="text-gray-900">{report.vitals.cholesterol} mg/dL</p>
                    </div>
                  )}
                  {report.vitals.hba1c && (
                    <div>
                      <p className="text-gray-600">HbA1c</p>
                      <p className="text-gray-900">{report.vitals.hba1c}%</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
