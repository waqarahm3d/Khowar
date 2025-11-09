import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import Player from '../player/Player';
import MobileNav from '../navigation/MobileNav';
import Queue from '../player/Queue';
import useUIStore from '../../store/uiStore';

export default function MainLayout() {
  const { isQueueOpen } = useUIStore();

  return (
    <div className="h-screen flex flex-col bg-spotify-bg">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - hidden on mobile, fixed on desktop */}
        <Sidebar />

        {/* Main Content - takes full width on mobile, offset by sidebar on desktop */}
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          {/* Header */}
          <Header />

          {/* Page Content with proper padding */}
          <main className="flex-1 overflow-y-auto bg-spotify-bg pb-20 md:pb-24">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Queue Sidebar */}
        {isQueueOpen && <Queue />}
      </div>

      {/* Player - fixed at bottom */}
      <Player />

      {/* Mobile Navigation - only on mobile */}
      <MobileNav />
    </div>
  );
}
