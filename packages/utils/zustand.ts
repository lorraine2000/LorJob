import { create } from "zustand";

export type ValueStore<T> = {
	value: T;
	setValue: (value: T) => void;
	reset: () => void;
};

export function createValueStore<T>(initialValue: T) {
	return create<ValueStore<T>>((set) => ({
		value: initialValue,
		setValue: (value) => set({ value }),
		reset: () => set({ value: initialValue }),
	}));
}