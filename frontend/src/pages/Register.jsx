import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialLogin = (provider) => {
    // Redirect to backend OAuth endpoint
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <Link to="/" className="flex items-center gap-2">
            <MusicalNoteIcon className="w-8 h-8 text-black" />
            <span className="text-2xl font-bold text-black">Voice of Chitral</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-white rounded-lg p-8 md:p-12">
            <h1 className="text-center text-4xl md:text-5xl font-bold text-black mb-4">
              Sign up for free to start listening
            </h1>

            {/* Social Login Buttons */}
            <div className="space-y-4 mb-8 mt-10">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign up with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm font-medium text-gray-900">OR</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                  What's your email?
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email."
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                  Create a password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password."
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-0 transition-colors"
                />
                <p className="mt-2 text-sm text-gray-600">Use at least 6 characters.</p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-bold text-black mb-2">
                  What should we call you?
                </label>
                <input
                  id="displayName"
                  type="text"
                  name="displayName"
                  placeholder="Enter a profile name."
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-0 transition-colors"
                />
                <p className="mt-2 text-sm text-gray-600">This appears on your profile.</p>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-bold text-black mb-2">
                  Choose a username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter a username."
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={30}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-0 transition-colors"
                />
                <p className="mt-2 text-sm text-gray-600">Must be 3-30 characters.</p>
              </div>

              <div className="pt-4">
                <p className="text-xs text-gray-600 mb-4">
                  By clicking on sign-up, you agree to Voice of Chitral's{' '}
                  <a href="#" className="text-[#1DB954] underline hover:text-[#1ed760]">
                    Terms and Conditions of Use
                  </a>
                  .
                </p>

                <p className="text-xs text-gray-600 mb-6">
                  To learn more about how Voice of Chitral collects, uses, shares and protects your personal data, please see{' '}
                  <a href="#" className="text-[#1DB954] underline hover:text-[#1ed760]">
                    Voice of Chitral's Privacy Policy
                  </a>
                  .
                </p>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 text-black font-bold py-4 rounded-full transition-all transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </button>
              </div>
            </form>
          </div>

          {/* Log in prompt */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-semibold">
              Already have an account?{' '}
              <Link to="/login" className="text-black underline hover:text-[#1DB954]">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
