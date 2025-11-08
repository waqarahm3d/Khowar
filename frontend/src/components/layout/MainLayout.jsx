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
    <div className="h-screen flex flex-col bg-black">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-primary-900/20 to-black">
            <Outlet />
          </main>
        </div>

        {/* Queue Sidebar */}
        <Queue />
      </div>

      {/* Player */}
      <Player />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
