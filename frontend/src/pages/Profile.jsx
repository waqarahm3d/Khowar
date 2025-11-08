import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@antml:react-query';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, updatePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      const result = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (result.success) {
        toast.success('Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Profile Settings</h1>

      {/* User Info */}
      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.displayName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.displayName}</h2>
            <p className="text-gray-400">@{user?.username}</p>
            {user?.isPremium && (
              <span className="inline-block mt-1 px-3 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-full">
                Premium
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 font-semibold ${
            activeTab === 'profile'
              ? 'text-white border-b-2 border-primary-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`pb-3 px-4 font-semibold ${
            activeTab === 'password'
              ? 'text-white border-b-2 border-primary-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Display Name</label>
              <Input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Username</label>
              <Input
                type="text"
                value={user?.username}
                disabled
                className="bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
              />
              <p className="text-sm text-gray-400 mt-1">Username cannot be changed</p>
            </div>
          </div>

          <Button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg"
          >
            Save Changes
          </Button>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Current Password</label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...profileData, confirmPassword: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg"
          >
            Update Password
          </Button>
        </form>
      )}

      {/* Logout Button */}
      <div className="mt-12 pt-6 border-t border-white/10">
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}
