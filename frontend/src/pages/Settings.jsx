import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';

export default function Settings() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('account');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'playback', label: 'Playback' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="px-4 md:px-8 py-6 pb-32 md:pb-24 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-spotify-text mb-8">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-spotify-text-gray overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'text-spotify-text border-b-2 border-primary'
                : 'text-spotify-text-subdued hover:text-spotify-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="bg-spotify-elevated rounded-lg p-6">
            <h2 className="text-xl font-bold text-spotify-text mb-4">Account Overview</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-spotify-text-subdued">Username</p>
                <p className="text-spotify-text">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-spotify-text-subdued">Email</p>
                <p className="text-spotify-text">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-spotify-text-subdued">Subscription</p>
                <p className="text-spotify-text">{user?.isPremium ? 'Premium' : 'Free'}</p>
              </div>
            </div>
          </div>

          <div className="bg-spotify-elevated rounded-lg p-6">
            <h3 className="text-lg font-semibold text-spotify-text mb-4">Profile Settings</h3>
            <p className="text-spotify-text-subdued mb-4">Manage your profile settings</p>
            <Button
              onClick={() => window.location.href = '/profile'}
              className="bg-primary hover:bg-primary-light text-black font-semibold px-6 py-2 rounded-full transition"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      )}

      {/* Playback Settings */}
      {activeTab === 'playback' && (
        <div className="space-y-6">
          <div className="bg-spotify-elevated rounded-lg p-6">
            <h2 className="text-xl font-bold text-spotify-text mb-4">Playback</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-spotify-text">Autoplay</p>
                  <p className="text-sm text-spotify-text-subdued">Play similar songs when your music ends</p>
                </div>
                <input type="checkbox" className="w-12 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <div className="bg-spotify-elevated rounded-lg p-6">
          <h2 className="text-xl font-bold text-spotify-text mb-4">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-spotify-text">Private session</p>
                <p className="text-sm text-spotify-text-subdued">Your listening activity won't be shared</p>
              </div>
              <input type="checkbox" className="w-12 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-spotify-elevated rounded-lg p-6">
          <h2 className="text-xl font-bold text-spotify-text mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-spotify-text">Email notifications</p>
                <p className="text-sm text-spotify-text-subdued">Receive email updates about new releases and features</p>
              </div>
              <input type="checkbox" className="w-12 h-6" defaultChecked />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
