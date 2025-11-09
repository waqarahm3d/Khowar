import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loading from '../components/common/Loading';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`);
        const data = await response.json();

        if (data.success) {
          setSuccess(true);
          toast.success('Email verified successfully!');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          toast.error(data.message || 'Verification failed');
          setSuccess(false);
        }
      } catch (error) {
        toast.error('Verification failed. Please try again.');
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-spotify-bg flex items-center justify-center">
        <div className="text-center">
          <Loading size="lg" />
          <p className="text-spotify-text mt-4">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-spotify-elevated rounded-lg p-8 text-center">
        {success ? (
          <>
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-spotify-text mb-2">Email Verified!</h1>
            <p className="text-spotify-text-subdued">Your email has been successfully verified. Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-spotify-text mb-2">Verification Failed</h1>
            <p className="text-spotify-text-subdued mb-6">The verification link may be expired or invalid.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary-light text-black font-semibold px-6 py-3 rounded-full transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
