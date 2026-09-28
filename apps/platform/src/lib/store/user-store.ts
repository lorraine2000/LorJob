import { createValueStore } from "@jobi/utils/zustand";
import { PlatformUserData } from "packages/api-types";

export const useUserStore = createValueStore<{ isInitialized: boolean | null; user: PlatformUserData | null }>({
	isInitialized: null,
	user: null,
});
