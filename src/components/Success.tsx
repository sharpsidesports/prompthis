import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // You can verify the session here if needed
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for subscribing to Prompthis! You now have access to unlimited prompts and advanced features.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            Session ID: {sessionId}
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Prompthis
        </button>
      </div>
    </div>
  );
}; 