import { create } from 'zustand';

interface UIState {
  isProfileSidebarOpen: boolean;
  openProfileSidebar: () => void;
  closeProfileSidebar: () => void;
  toggleProfileSidebar: () => void;
  
  // Success Overlay
  isSuccessOverlayOpen: boolean;
  successOverlayMessage: string;
  successOverlayPath: string;
  successOverlayFullPage: boolean;
  triggerSuccessOverlay: (message?: string, duration?: number, animationPath?: string, isFullPage?: boolean) => void;
  closeSuccessOverlay: () => void;

  // Loading Overlay
  isLoadingOverlayOpen: boolean;
  showLoadingOverlay: () => void;
  hideLoadingOverlay: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isProfileSidebarOpen: false,
  openProfileSidebar: () => set({ isProfileSidebarOpen: true }),
  closeProfileSidebar: () => set({ isProfileSidebarOpen: false }),
  toggleProfileSidebar: () => set((state) => ({ isProfileSidebarOpen: !state.isProfileSidebarOpen })),

  isSuccessOverlayOpen: false,
  successOverlayMessage: '',
  successOverlayPath: '/success.json',
  successOverlayFullPage: false,
  triggerSuccessOverlay: (message = 'Operation Successful!', duration = 3000, animationPath = '/success.json', isFullPage = false) => {
    set({ isSuccessOverlayOpen: true, successOverlayMessage: message, successOverlayPath: animationPath, successOverlayFullPage: isFullPage });
    setTimeout(() => {
      set({ isSuccessOverlayOpen: false });
    }, duration);
  },
  closeSuccessOverlay: () => set({ isSuccessOverlayOpen: false }),

  isLoadingOverlayOpen: false,
  showLoadingOverlay: () => set({ isLoadingOverlayOpen: true }),
  hideLoadingOverlay: () => set({ isLoadingOverlayOpen: false }),
}));
