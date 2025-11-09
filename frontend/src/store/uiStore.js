import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Sidebar
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),

  // Queue panel
  isQueueOpen: false,
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
  closeQueue: () => set({ isQueueOpen: false }),
  openQueue: () => set({ isQueueOpen: true }),

  // Modals
  activeModal: null,
  modalData: null,
  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Loading states
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useUIStore;
