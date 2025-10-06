import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imagePath?: string) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3669"
  }${imagePath}`;
}
