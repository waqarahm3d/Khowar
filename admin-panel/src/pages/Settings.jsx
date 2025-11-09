import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Save, RefreshCw, Database, Mail, Lock, Settings as SettingsIcon, Globe } from 'lucide-react'
import { getSettings, updateSettings } from '../services/api'

export default function Settings() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('storage')
  const [settings, setSettings] = useState({
    // Storage
    STORAGE_PROVIDER: 'local',
    UPLOAD_PATH: './uploads',
    MAX_FILE_SIZE: '50000000',

    // AWS S3
    AWS_ACCESS_KEY_ID: '',
    AWS_SECRET_ACCESS_KEY: '',
    AWS_BUCKET_NAME: '',
    AWS_REGION: 'us-east-1',

    // Wasabi
    WASABI_ACCESS_KEY_ID: '',
    WASABI_SECRET_ACCESS_KEY: '',
    WASABI_BUCKET_NAME: '',
    WASABI_REGION: 'us-east-1',
    WASABI_ENDPOINT: 'https://s3.us-east-1.wasabisys.com',

    // Backblaze B2
    BACKBLAZE_KEY_ID: '',
    BACKBLAZE_APPLICATION_KEY: '',
    BACKBLAZE_BUCKET_NAME: '',
    BACKBLAZE_REGION: 'us-west-000',
    BACKBLAZE_ENDPOINT: 'https://s3.us-west-000.backblazeb2.com',

    // Cloudflare R2
    CLOUDFLARE_ACCESS_KEY_ID: '',
    CLOUDFLARE_SECRET_ACCESS_KEY: '',
    CLOUDFLARE_BUCKET_NAME: '',
    CLOUDFLARE_ACCOUNT_ID: '',

    // Email
    EMAIL_HOST: 'smtp.gmail.com',
    EMAIL_PORT: '587',
    EMAIL_SECURE: 'false',
    EMAIL_USER: '',
    EMAIL_PASSWORD: '',
    EMAIL_FROM: '',

    // OAuth
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    GOOGLE_CALLBACK_URL: '',
    FACEBOOK_APP_ID: '',
    FACEBOOK_APP_SECRET: '',
    FACEBOOK_CALLBACK_URL: '',

    // App Settings
    CLIENT_URL: '',
    ADMIN_URL: '',
    NODE_ENV: 'production',
    JWT_EXPIRE: '7d',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })

  useEffect(() => {
    if (data?.data?.data) {
      setSettings(prev => ({ ...prev, ...data.data.data }))
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success('Settings saved successfully! Restart backend to apply changes.')
      queryClient.invalidateQueries(['settings'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(settings)
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: 'storage', label: 'Storage', icon: Database },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'oauth', label: 'OAuth', icon: Lock },
    { id: 'app', label: 'Application', icon: Globe },
    { id: 'system', label: 'System', icon: SettingsIcon },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure backend settings and environment variables
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Storage Settings */}
          {activeTab === 'storage' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Storage Configuration</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Provider
                </label>
                <select
                  value={settings.STORAGE_PROVIDER}
                  onChange={(e) => handleChange('STORAGE_PROVIDER', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="local">Local Storage</option>
                  <option value="aws">AWS S3</option>
                  <option value="wasabi">Wasabi S3</option>
                  <option value="backblaze">Backblaze B2</option>
                  <option value="cloudflare">Cloudflare R2</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Select where uploaded files should be stored
                </p>
              </div>

              {settings.STORAGE_PROVIDER === 'local' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Path
                    </label>
                    <input
                      type="text"
                      value={settings.UPLOAD_PATH}
                      onChange={(e) => handleChange('UPLOAD_PATH', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max File Size (bytes)
                    </label>
                    <input
                      type="number"
                      value={settings.MAX_FILE_SIZE}
                      onChange={(e) => handleChange('MAX_FILE_SIZE', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Current: {(parseInt(settings.MAX_FILE_SIZE) / 1024 / 1024).toFixed(0)} MB
                    </p>
                  </div>
                </>
              )}

              {settings.STORAGE_PROVIDER === 'aws' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AWS Access Key ID
                      </label>
                      <input
                        type="text"
                        value={settings.AWS_ACCESS_KEY_ID}
                        onChange={(e) => handleChange('AWS_ACCESS_KEY_ID', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AWS Secret Access Key
                      </label>
                      <input
                        type="password"
                        value={settings.AWS_SECRET_ACCESS_KEY}
                        onChange={(e) => handleChange('AWS_SECRET_ACCESS_KEY', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bucket Name
                      </label>
                      <input
                        type="text"
                        value={settings.AWS_BUCKET_NAME}
                        onChange={(e) => handleChange('AWS_BUCKET_NAME', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region
                      </label>
                      <input
                        type="text"
                        value={settings.AWS_REGION}
                        onChange={(e) => handleChange('AWS_REGION', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="us-east-1"
                      />
                    </div>
                  </div>
                </>
              )}

              {settings.STORAGE_PROVIDER === 'wasabi' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wasabi Access Key ID
                      </label>
                      <input
                        type="text"
                        value={settings.WASABI_ACCESS_KEY_ID}
                        onChange={(e) => handleChange('WASABI_ACCESS_KEY_ID', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wasabi Secret Access Key
                      </label>
                      <input
                        type="password"
                        value={settings.WASABI_SECRET_ACCESS_KEY}
                        onChange={(e) => handleChange('WASABI_SECRET_ACCESS_KEY', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bucket Name
                      </label>
                      <input
                        type="text"
                        value={settings.WASABI_BUCKET_NAME}
                        onChange={(e) => handleChange('WASABI_BUCKET_NAME', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region
                      </label>
                      <input
                        type="text"
                        value={settings.WASABI_REGION}
                        onChange={(e) => handleChange('WASABI_REGION', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="us-east-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endpoint
                    </label>
                    <input
                      type="text"
                      value={settings.WASABI_ENDPOINT}
                      onChange={(e) => handleChange('WASABI_ENDPOINT', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </>
              )}

              {settings.STORAGE_PROVIDER === 'backblaze' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backblaze Key ID
                      </label>
                      <input
                        type="text"
                        value={settings.BACKBLAZE_KEY_ID}
                        onChange={(e) => handleChange('BACKBLAZE_KEY_ID', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Key
                      </label>
                      <input
                        type="password"
                        value={settings.BACKBLAZE_APPLICATION_KEY}
                        onChange={(e) => handleChange('BACKBLAZE_APPLICATION_KEY', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bucket Name
                      </label>
                      <input
                        type="text"
                        value={settings.BACKBLAZE_BUCKET_NAME}
                        onChange={(e) => handleChange('BACKBLAZE_BUCKET_NAME', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region
                      </label>
                      <input
                        type="text"
                        value={settings.BACKBLAZE_REGION}
                        onChange={(e) => handleChange('BACKBLAZE_REGION', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="us-west-000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endpoint
                    </label>
                    <input
                      type="text"
                      value={settings.BACKBLAZE_ENDPOINT}
                      onChange={(e) => handleChange('BACKBLAZE_ENDPOINT', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://s3.us-west-000.backblazeb2.com"
                    />
                  </div>
                </>
              )}

              {settings.STORAGE_PROVIDER === 'cloudflare' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Key ID
                      </label>
                      <input
                        type="text"
                        value={settings.CLOUDFLARE_ACCESS_KEY_ID}
                        onChange={(e) => handleChange('CLOUDFLARE_ACCESS_KEY_ID', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret Access Key
                      </label>
                      <input
                        type="password"
                        value={settings.CLOUDFLARE_SECRET_ACCESS_KEY}
                        onChange={(e) => handleChange('CLOUDFLARE_SECRET_ACCESS_KEY', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bucket Name
                      </label>
                      <input
                        type="text"
                        value={settings.CLOUDFLARE_BUCKET_NAME}
                        onChange={(e) => handleChange('CLOUDFLARE_BUCKET_NAME', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account ID
                      </label>
                      <input
                        type="text"
                        value={settings.CLOUDFLARE_ACCOUNT_ID}
                        onChange={(e) => handleChange('CLOUDFLARE_ACCOUNT_ID', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endpoint URL
                    </label>
                    <input
                      type="text"
                      value={settings.CLOUDFLARE_ENDPOINT || ''}
                      onChange={(e) => handleChange('CLOUDFLARE_ENDPOINT', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://<account_id>.r2.cloudflarestorage.com"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Optional: Custom endpoint URL for Cloudflare R2
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Email Configuration</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.EMAIL_HOST}
                    onChange={(e) => handleChange('EMAIL_HOST', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.EMAIL_PORT}
                    onChange={(e) => handleChange('EMAIL_PORT', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="587"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.EMAIL_SECURE === 'true'}
                    onChange={(e) => handleChange('EMAIL_SECURE', e.target.checked ? 'true' : 'false')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Use TLS/SSL</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email User / API Key
                </label>
                <input
                  type="text"
                  value={settings.EMAIL_USER}
                  onChange={(e) => handleChange('EMAIL_USER', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="your-email@gmail.com or emailapikey"
                />
                <p className="text-sm text-gray-500 mt-1">
                  For ZeptoMail, use "emailapikey". For Gmail, use your email address.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Password / App Password
                </label>
                <input
                  type="password"
                  value={settings.EMAIL_PASSWORD}
                  onChange={(e) => handleChange('EMAIL_PASSWORD', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  For Gmail, use an App Password from your Google Account settings
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email Address
                </label>
                <input
                  type="email"
                  value={settings.EMAIL_FROM}
                  onChange={(e) => handleChange('EMAIL_FROM', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="noreply@voiceofchitral.com"
                />
              </div>
            </div>
          )}

          {/* OAuth Settings */}
          {activeTab === 'oauth' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">OAuth Configuration</h2>

              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Google OAuth</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={settings.GOOGLE_CLIENT_ID}
                    onChange={(e) => handleChange('GOOGLE_CLIENT_ID', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={settings.GOOGLE_CLIENT_SECRET}
                    onChange={(e) => handleChange('GOOGLE_CLIENT_SECRET', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Callback URL
                  </label>
                  <input
                    type="text"
                    value={settings.GOOGLE_CALLBACK_URL}
                    onChange={(e) => handleChange('GOOGLE_CALLBACK_URL', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://api.voiceofchitral.com/api/auth/google/callback"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Facebook OAuth</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={settings.FACEBOOK_APP_ID}
                    onChange={(e) => handleChange('FACEBOOK_APP_ID', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Secret
                  </label>
                  <input
                    type="password"
                    value={settings.FACEBOOK_APP_SECRET}
                    onChange={(e) => handleChange('FACEBOOK_APP_SECRET', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Callback URL
                  </label>
                  <input
                    type="text"
                    value={settings.FACEBOOK_CALLBACK_URL}
                    onChange={(e) => handleChange('FACEBOOK_CALLBACK_URL', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://api.voiceofchitral.com/api/auth/facebook/callback"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Application Settings */}
          {activeTab === 'app' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Application Settings</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client URL (Frontend)
                </label>
                <input
                  type="url"
                  value={settings.CLIENT_URL}
                  onChange={(e) => handleChange('CLIENT_URL', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://voiceofchitral.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  The URL where your frontend/user app is deployed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin URL
                </label>
                <input
                  type="url"
                  value={settings.ADMIN_URL}
                  onChange={(e) => handleChange('ADMIN_URL', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://admin.voiceofchitral.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  The URL where this admin panel is deployed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JWT Token Expiry
                </label>
                <input
                  type="text"
                  value={settings.JWT_EXPIRE}
                  onChange={(e) => handleChange('JWT_EXPIRE', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="7d"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Examples: 1h, 7d, 30d, 1y
                </p>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environment
                </label>
                <select
                  value={settings.NODE_ENV}
                  onChange={(e) => handleChange('NODE_ENV', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="development">Development</option>
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Important Notes</h3>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Changes require backend restart to take effect</li>
                  <li>Always backup your configuration before making changes</li>
                  <li>Test changes in a staging environment first</li>
                  <li>Sensitive data is encrypted when saved</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">📋 Restart Backend</h3>
                <p className="text-sm text-blue-700 mb-3">
                  After saving settings, restart the backend with:
                </p>
                <code className="block bg-blue-900 text-blue-100 px-3 py-2 rounded text-sm">
                  pm2 restart voice-of-chitral-backend
                </code>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => queryClient.invalidateQueries(['settings'])}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Reset
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
