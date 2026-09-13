import type { FabricOption } from "../types";

export const fabrics: FabricOption[] = [
  {
    name: "Italian Cotton Twill",
    weight: "120 GSM",
    weave: "Twill",
    origin: "Italy",
    category: "Formal",
    price: 800,
  },
  {
    name: "Egyptian Cotton Poplin",
    weight: "110 GSM",
    weave: "Poplin",
    origin: "Egypt",
    category: "Classic",
    price: 500,
  },
  {
    name: "Oxford Weave Cotton",
    weight: "150 GSM",
    weave: "Oxford",
    origin: "UK",
    category: "Casual",
    price: 0,
  },
  {
    name: "Linen Blend",
    weight: "140 GSM",
    weave: "Plain",
    origin: "Belgium",
    category: "Summer",
    price: 600,
  },
];

export const DEFAULT_FABRIC: FabricOption = fabrics[2];

export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}