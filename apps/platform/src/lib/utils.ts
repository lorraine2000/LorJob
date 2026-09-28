import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { fakeCandidatures, fakeUser } from "../data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// get fake data
export const Candidature = {
  list: async (orderBy?: string) => {
    await new Promise(r => setTimeout(r, 1000));
    // Ici tu peux utiliser orderBy si besoin
    return fakeCandidatures;
  }
};


export const User = {
  me: async () => {
    await new Promise(r => setTimeout(r, 500));
    return fakeUser;
  }
};
