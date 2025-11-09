import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  MusicalNoteIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { youtubeImportAPI } from '../api/youtubeImport';
import { artistsAPI } from '../api/artists';
import { albumsAPI } from '../api/albums';

export default function YouTubeImport() {
  const queryClient = useQueryClient();

  // State
  const [step, setStep] = useState(1); // 1: URL Input, 2: Metadata Preview, 3: Import Progress
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [importType, setImportType] = useState(null); // 'single', 'playlist', 'channel'

  // Settings
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Traditional');
  const [customTags, setCustomTags] = useState('');

  // Import job
  const [currentJobId, setCurrentJobId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  // Fetch dependencies status
  const { data: depsData } = useQuery({
    queryKey: ['youtube-dependencies'],
    queryFn: youtubeImportAPI.checkDependencies,
  });

  // Fetch artists for dropdown
  const { data: artistsData } = useQuery({
    queryKey: ['artists'],
    queryFn: () => artistsAPI.getAll(),
  });

  // Fetch albums for dropdown
  const { data: albumsData } = useQuery({
    queryKey: ['albums'],
    queryFn: () => albumsAPI.getAll(),
  });

  // Fetch job status (polling)
  const { data: jobData, refetch: refetchJob } = useQuery({
    queryKey: ['youtube-job', currentJobId],
    queryFn: () => youtubeImportAPI.getJobStatus(currentJobId),
    enabled: !!currentJobId && isPolling,
    refetchInterval: 2000, // Poll every 2 seconds
  });

  // Stop polling when job is completed or failed
  useEffect(() => {
    if (jobData?.data?.status === 'completed' || jobData?.data?.status === 'failed') {
      setIsPolling(false);
      if (jobData.data.status === 'completed') {
        toast.success('Import completed successfully!');
        // Reset form
        setTimeout(() => {
          handleReset();
        }, 3000);
      } else {
        toast.error(`Import failed: ${jobData.data.error?.message}`);
      }
    }
  }, [jobData]);

  // Validate and fetch metadata
  const handleFetchMetadata = async () => {
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsValidating(true);

    try {
      // Validate URL
      const validationResult = await youtubeImportAPI.validateUrl(youtubeUrl);

      if (!validationResult.data.valid) {
        toast.error('Invalid YouTube URL');
        return;
      }

      setImportType(validationResult.data.type);

      // Fetch metadata
      const metadataResult = await youtubeImportAPI.fetchMetadata(youtubeUrl);
      setMetadata(metadataResult.data);
      setStep(2);
      toast.success('Metadata fetched successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch metadata');
    } finally {
      setIsValidating(false);
    }
  };

  // Import mutation
  const importMutation = useMutation({
    mutationFn: (settings) => youtubeImportAPI.importVideo(youtubeUrl, settings),
    onSuccess: (data) => {
      setCurrentJobId(data.data.jobId);
      setIsPolling(true);
      setStep(3);
      toast.success('Import started! Please wait...');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to start import');
    },
  });

  // Handle import
  const handleImport = () => {
    const settings = {
      artist: selectedArtist || undefined,
      album: selectedAlbum || undefined,
      genre: selectedGenre,
      tags: customTags ? customTags.split(',').map(t => t.trim()) : []
    };

    importMutation.mutate(settings);
  };

  // Reset form
  const handleReset = () => {
    setStep(1);
    setYoutubeUrl('');
    setMetadata(null);
    setImportType(null);
    setSelectedArtist('');
    setSelectedAlbum('');
    setSelectedGenre('Traditional');
    setCustomTags('');
    setCurrentJobId(null);
    setIsPolling(false);
  };

  // Check dependencies
  const dependenciesReady = depsData?.data?.ready;

  if (!dependenciesReady) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Dependencies Not Installed
              </h3>
              <p className="text-yellow-800 mb-4">
                The YouTube import feature requires the following dependencies:
              </p>
              <ul className="list-disc list-inside space-y-1 text-yellow-800 mb-4">
                <li>yt-dlp {depsData?.data?.ytdlp ? '✓' : '✗'}</li>
                <li>ffmpeg {depsData?.data?.ffmpeg ? '✓' : '✗'}</li>
              </ul>
              <p className="text-sm text-yellow-700">
                Please install the missing dependencies on the server. See the documentation for installation instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MusicalNoteIcon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">YouTube Music Import</h1>
        </div>
        <p className="text-gray-600">
          Import music directly from YouTube to your platform
        </p>
      </div>

      {/* Step 1: URL Input */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Step 1: Enter YouTube URL
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleFetchMetadata()}
              />
              <p className="mt-2 text-sm text-gray-500">
                Supports: Single videos, playlists, and channels
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleFetchMetadata}
                disabled={isValidating || !youtubeUrl.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Fetching Metadata...
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5" />
                    Fetch Metadata
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900 font-medium mb-2">
              ⚠️ Copyright Notice
            </p>
            <p className="text-sm text-amber-800">
              By using this feature, you confirm that you have the right to distribute this music and have obtained necessary permissions from artists/copyright holders.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Metadata Preview & Settings */}
      {step === 2 && metadata && (
        <div className="space-y-6">
          {/* Metadata Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Step 2: Review & Configure
            </h2>

            <div className="flex gap-6 mb-6">
              {/* Thumbnail */}
              {metadata.thumbnail && (
                <img
                  src={metadata.thumbnail}
                  alt={metadata.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {metadata.title}
                </h3>
                <p className="text-gray-600 mb-1">
                  <strong>Artist:</strong> {metadata.artist}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Duration:</strong> {Math.floor(metadata.duration / 60)}:{(metadata.duration % 60).toString().padStart(2, '0')}
                </p>
                <p className="text-gray-600">
                  <strong>Uploader:</strong> {metadata.uploader}
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              {/* Artist Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artist (Optional Override)
                </label>
                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Use detected: {metadata.artist}</option>
                  {artistsData?.data?.map((artist) => (
                    <option key={artist._id} value={artist._id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Album Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Album (Optional)
                </label>
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No Album</option>
                  {albumsData?.data?.map((album) => (
                    <option key={album._id} value={album._id}>
                      {album.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Traditional">Traditional</option>
                  <option value="Folk">Folk</option>
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Classical">Classical</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={customTags}
                  onChange={(e) => setCustomTags(e.target.value)}
                  placeholder="khowar, traditional, chitral"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={importMutation.isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {importMutation.isPending ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Starting Import...
                  </>
                ) : (
                  'Start Import'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Import Progress */}
      {step === 3 && jobData && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Step 3: Import Progress
          </h2>

          {/* Progress */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {jobData.data.progress?.currentStep || 'Processing...'}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {jobData.data.progress?.percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${jobData.data.progress?.percentage || 0}%` }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              {jobData.data.status === 'processing' && (
                <>
                  <ArrowPathIcon className="w-6 h-6 text-indigo-600 animate-spin" />
                  <span className="text-gray-700">Importing...</span>
                </>
              )}
              {jobData.data.status === 'completed' && (
                <>
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">Import completed successfully!</span>
                </>
              )}
              {jobData.data.status === 'failed' && (
                <>
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                  <span className="text-gray-700">
                    Import failed: {jobData.data.error?.message}
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            {(jobData.data.status === 'completed' || jobData.data.status === 'failed') && (
              <button
                onClick={handleReset}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Import Another Song
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
