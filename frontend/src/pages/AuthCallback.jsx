import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Loading from '../components/common/Loading';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');

    if (token) {
      // Store the token
      setToken(token);
      localStorage.setItem('token', token);

      // Fetch user data
      fetchUser().then(() => {
        const providerName = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'OAuth';
        toast.success(`Logged in with ${providerName}!`);
        navigate('/');
      }).catch(() => {
        toast.error('Failed to log in. Please try again.');
        navigate('/login');
      });
    } else {
      toast.error('Authentication failed. No token received.');
      navigate('/login');
    }
  }, [searchParams, setToken, fetchUser, navigate]);

  return (
    <div className="min-h-screen bg-spotify-bg flex items-center justify-center">
      <div className="text-center">
        <Loading size="lg" />
        <p className="text-spotify-text mt-4">Completing sign in...</p>
      </div>
    </div>
  );
}
