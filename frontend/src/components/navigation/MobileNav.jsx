import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as MagnifyingGlassSolid,
  MusicalNoteIcon as MusicalNoteSolid,
  UserCircleIcon as UserCircleSolid,
} from '@heroicons/react/24/solid';
import useAuthStore from '../../store/authStore';

const MobileNav = () => {
  const { isAuthenticated } = useAuthStore();

  const navItems = [
    { to: '/', label: 'Home', icon: HomeIcon, iconSolid: HomeSolid },
    { to: '/search', label: 'Search', icon: MagnifyingGlassIcon, iconSolid: MagnifyingGlassSolid },
    { to: '/browse', label: 'Browse', icon: MusicalNoteIcon, iconSolid: MusicalNoteSolid },
    {
      to: isAuthenticated ? '/library/playlists' : '/login',
      label: 'Library',
      icon: UserCircleIcon,
      iconSolid: UserCircleSolid,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-spotify-black border-t border-spotify-elevated z-30 md:hidden pb-safe">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => (
          <MobileNavLink key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
};

const MobileNavLink = ({ to, label, icon: Icon, iconSolid: IconSolid }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-2 px-4 rounded-lg transition ${
          isActive ? 'text-spotify-text' : 'text-spotify-text-subdued'
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
          <span className="text-xs mt-1 font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default MobileNav;
