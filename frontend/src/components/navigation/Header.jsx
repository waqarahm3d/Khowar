import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import useUIStore from '../../store/uiStore';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { toggleSidebar } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-spotify-black bg-opacity-90 backdrop-blur-md border-b border-spotify-elevated z-20">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Navigation */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-spotify-hover transition md:hidden"
            title="Menu"
          >
            <Bars3Icon className="w-6 h-6 text-spotify-text" />
          </button>

          {/* Back/Forward buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-spotify-black bg-opacity-70 hover:bg-spotify-hover transition"
              title="Go back"
            >
              <ChevronLeftIcon className="w-5 h-5 text-spotify-text" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="p-2 rounded-full bg-spotify-black bg-opacity-70 hover:bg-spotify-hover transition"
              title="Go forward"
            >
              <ChevronRightIcon className="w-5 h-5 text-spotify-text" />
            </button>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-spotify-text-subdued" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              className="w-full pl-10 pr-4 py-2 bg-spotify-elevated border border-spotify-hover rounded-full text-sm text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-primary focus:bg-spotify-hover transition"
            />
          </form>
        </div>

        {/* Right: User menu */}
        <div className="flex items-center gap-3">
          {/* Notifications (placeholder) */}
          {isAuthenticated && (
            <button
              className="p-2 rounded-full hover:bg-spotify-hover transition relative"
              title="Notifications"
            >
              <BellIcon className="w-6 h-6 text-spotify-text" />
              {/* Notification badge (example) */}
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" /> */}
            </button>
          )}

          {/* User menu */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-spotify-hover transition"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-spotify-elevated border border-spotify-hover rounded-lg shadow-lg z-20">
                    <div className="p-4 border-b border-spotify-hover">
                      <div className="font-medium text-spotify-text">
                        {user.displayName || user.username}
                      </div>
                      <div className="text-sm text-spotify-text-subdued">{user.email}</div>
                      {user.isPremium && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-primary text-white rounded">
                          Premium
                        </span>
                      )}
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-spotify-text-subdued hover:bg-spotify-hover hover:text-spotify-text transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircleIcon className="w-5 h-5" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-spotify-text-subdued hover:bg-spotify-hover hover:text-spotify-text transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-spotify-hover py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-spotify-text-subdued hover:bg-spotify-hover hover:text-spotify-text transition"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-spotify-text-subdued hover:text-spotify-text transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
