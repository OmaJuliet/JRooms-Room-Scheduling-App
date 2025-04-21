import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts "CONFERENCE_HALL" to "Conference Hall"
 * @param category - A raw category string (e.g. "CONFERENCE_HALL")
 * @returns A formatted category string (e.g. "Conference Hall")
 */
export function formatCategory(category?: string) {
  return category
    ? category
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";
}