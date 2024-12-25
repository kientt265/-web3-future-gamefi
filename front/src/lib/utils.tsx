import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address?: string): string| undefined {
  
  if(address) {
    const start = address.slice(0, 6);
  const end = address.slice(-4);  
  return `${start}...${end}`;
  } else undefined
}