import { create } from "zustand";

interface RoadmapState {
  isModalOpen: boolean;
  authType: "login" | "register";
  onModalOpen: () => void;
  onModalClose: () => void;
  setAuthType: (type: "login" | "register") => void;
}

const roadmapState = create<RoadmapState>((set) => ({
  isModalOpen: false,
  authType: "login",
  onModalOpen: () => set({ isModalOpen: true }),
  onModalClose: () => set({ isModalOpen: false }),
  setAuthType: (type: "login" | "register") => set({ authType: type }),
}));

export default roadmapState;
