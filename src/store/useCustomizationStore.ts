import { create } from "zustand";
import type { FabricOption, Measurements } from "../types";

interface CustomizationState {
  productId: string | null;
  fabric: FabricOption | null;
  fit: string | null;
  measurements: Measurements | null;
  setProduct: (productId: string) => void;
  setFabric: (fabric: FabricOption) => void;
  setFit: (fit: string) => void;
  setMeasurements: (measurements: Measurements) => void;
  reset: () => void;
}

export const useCustomizationStore = create<CustomizationState>((set) => ({
  productId: null,
  fabric: null,
  fit: null,
  measurements: null,
  setProduct: (productId) => set({ productId }),
  setFabric: (fabric) => set({ fabric }),
  setFit: (fit) => set({ fit }),
  setMeasurements: (measurements) => set({ measurements }),
  reset: () => set({ productId: null, fabric: null, fit: null, measurements: null }),
}));