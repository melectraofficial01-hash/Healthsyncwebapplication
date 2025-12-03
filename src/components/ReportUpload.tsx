import { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface Props {
  accessToken: string;
  onUploadSuccess: () => void;
}

export function ReportUpload({ accessToken, onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('Blood Test');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reportType', reportType);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-62259918/reports/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(true);
      setFile(null);
      onUploadSuccess();

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-900 mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Upload Medical Report
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option>Blood Test</option>
            <option>ECG Report</option>
            <option>X-Ray</option>
            <option>MRI Scan</option>
            <option>CT Scan</option>
            <option>General Checkup</option>
            <option>Prescription</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Select File</label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer"
            />
          </div>
          <p className="text-gray-500 mt-1">Accepts images and PDF files</p>
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-blue-900 flex-1">{file.name}</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload & Extract Vitals
            </>
          )}
        </button>

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-800">
            <CheckCircle className="w-5 h-5" />
            Report uploaded successfully! Vitals extracted.
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 rounded-lg text-red-800">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">
          <strong>Demo Mode:</strong> OCR is simulated with sample data
        </p>
      </div>
    </div>
  );
}
