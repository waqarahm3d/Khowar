import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  RectangleStackIcon,
  HeartIcon,
  ClockIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as MagnifyingGlassSolid,
  MusicalNoteIcon as MusicalNoteSolid,
  UserGroupIcon as UserGroupSolid,
  RectangleStackIcon as RectangleStackSolid,
  HeartIcon as HeartSolid,
  ClockIcon as ClockSolid,
} from '@heroicons/react/24/solid';
import useUIStore from '../../store/uiStore';
import useAuthStore from '../../store/authStore';
import { APP_NAME } from '../../utils/constants';

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();

  const mainNavItems = [
    { to: '/', label: 'Home', icon: HomeIcon, iconSolid: HomeSolid },
    { to: '/search', label: 'Search', icon: MagnifyingGlassIcon, iconSolid: MagnifyingGlassSolid },
    { to: '/browse', label: 'Browse', icon: MusicalNoteIcon, iconSolid: MusicalNoteSolid },
    { to: '/artists', label: 'Artists', icon: UserGroupIcon, iconSolid: UserGroupSolid },
    { to: '/albums', label: 'Albums', icon: RectangleStackIcon, iconSolid: RectangleStackSolid },
  ];

  const libraryNavItems = isAuthenticated
    ? [
        { to: '/library/playlists', label: 'Playlists', icon: RectangleStackIcon, iconSolid: RectangleStackSolid },
        { to: '/library/liked', label: 'Liked Songs', icon: HeartIcon, iconSolid: HeartSolid },
        { to: '/library/recent', label: 'Recently Played', icon: ClockIcon, iconSolid: ClockSolid },
      ]
    : [];

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <MusicalNoteSolid className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
            </NavLink>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {mainNavItems.map((item) => (
                <SidebarLink key={item.to} {...item} />
              ))}
            </div>

            {/* Library Section */}
            {isAuthenticated && (
              <>
                <div className="px-6 mt-6 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Library
                  </h3>
                </div>
                <div className="px-3 space-y-1">
                  {libraryNavItems.map((item) => (
                    <SidebarLink key={item.to} {...item} />
                  ))}
                </div>
              </>
            )}

            {/* Playlists */}
            {isAuthenticated && (
              <>
                <div className="px-6 mt-6 mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Playlists
                  </h3>
                  <button
                    className="p-1 rounded hover:bg-gray-100 transition"
                    title="Create Playlist"
                  >
                    <PlusCircleIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="px-3 space-y-1">
                  {/* User playlists will be loaded here */}
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No playlists yet
                  </div>
                </div>
              </>
            )}
          </nav>

          {/* User Info (bottom) */}
          {isAuthenticated && user && (
            <div className="p-4 border-t border-gray-200">
              <NavLink
                to="/profile"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName || user.username}
                  </div>
                  <div className="text-xs text-gray-500">View profile</div>
                </div>
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ to, label, icon: Icon, iconSolid: IconSolid }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? 'bg-primary bg-opacity-10 text-primary'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <IconSolid className="w-6 h-6" />
          ) : (
            <Icon className="w-6 h-6" />
          )}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;
