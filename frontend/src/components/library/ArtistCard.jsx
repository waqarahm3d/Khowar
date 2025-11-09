import { Link } from 'react-router-dom';
import { UserCircleIcon, PlayIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { getFileUrl } from '../../utils/formatTime';
import useAuthStore from '../../store/authStore';
import { artistsAPI } from '../../api/artists';

const ArtistCard = ({ artist }) => {
  const { isAuthenticated, user } = useAuthStore();
  // followers is a number (count), not an array - check if following via API if needed
  const [isFollowing, setIsFollowing] = useState(false);

  const imageUrl = artist.image ? getFileUrl(artist.image) : null;

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    try {
      if (isFollowing) {
        await artistsAPI.unfollow(artist._id || artist.id);
        setIsFollowing(false);
      } else {
        await artistsAPI.follow(artist._id || artist.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <Link
      to={`/artists/${artist._id || artist.id}`}
      className="group bg-white rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer block"
    >
      <div className="relative mb-3">
        {/* Artist Image (circular) */}
        <div className="aspect-square bg-gray-100 rounded-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserCircleIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Play button overlay */}
        <button
          className="absolute bottom-2 right-2 w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
        >
          <PlayIcon className="w-6 h-6 ml-0.5" />
        </button>
      </div>

      {/* Artist Info */}
      <div className="space-y-2 text-center">
        <h3 className="font-semibold text-gray-900 truncate text-sm">
          {artist.name}
        </h3>

        <div className="text-xs text-gray-500">
          {artist.verified && (
            <span className="inline-block px-2 py-1 bg-primary bg-opacity-10 text-primary rounded-full font-medium mb-1">
              ✓ Verified Artist
            </span>
          )}
          <div className="flex items-center justify-center gap-2">
            {artist.totalSongs > 0 && <span>{artist.totalSongs} songs</span>}
            {artist.followers > 0 && (
              <>
                <span>•</span>
                <span>
                  {artist.followers.toLocaleString()} follower
                  {artist.followers !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Follow button */}
        {isAuthenticated && (
          <button
            onClick={handleFollow}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              isFollowing
                ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
    </Link>
  );
};

export default ArtistCard;
