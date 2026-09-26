import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useCustomizationStore = create<CustomizationState>()(
  persist(
    (set) => ({
      productId: null,
      fabric: null,
      fit: null,
      measurements: null,
      setProduct: (productId) => set({ productId }),
      setFabric: (fabric) => set({ fabric }),
      setFit: (fit) => set({ fit }),
      setMeasurements: (measurements) => set({ measurements }),
      reset: () =>
        set({ productId: null, fabric: null, fit: null, measurements: null }),
    }),
    // Matches the other three stores. Without this, reloading mid-flow threw
    // away the chosen fabric and fit, and /final-review/:id always bounced to
    // /category/artisanal-shirt because the guard reads `productId`.
    { name: "weavear-customization" }
  )
);