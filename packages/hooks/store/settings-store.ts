import type { Locales } from "@jobi/constants";
import { createValueStore } from "@jobi/utils/zustand";

export const useLocaleStore = createValueStore<Locales>("fr");
