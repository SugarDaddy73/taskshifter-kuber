import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
  }
	catch {
    return null;
  }
}

export function setToLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
