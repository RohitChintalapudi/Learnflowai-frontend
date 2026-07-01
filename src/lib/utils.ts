import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFirstLetterOfFirstName(fullName: string | undefined | null): string {
  if (!fullName) return "U";
  const trimmed = fullName.trim();
  if (!trimmed) return "U";
  
  // Split by whitespace to get the first name
  const firstName = trimmed.split(/\s+/)[0] || "";
  
  // Find the first alphabetical letter in the first name
  for (let i = 0; i < firstName.length; i++) {
    const char = firstName[i];
    if (/[a-zA-Z]/.test(char)) {
      return char.toUpperCase();
    }
  }
  
  // Fallback to the first character of the first name
  return (firstName.charAt(0) || "U").toUpperCase();
}
