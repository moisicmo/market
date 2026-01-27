import { TypeAction } from "@/models";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatTypeAction(action: TypeAction){
  return TypeAction[action as unknown as keyof typeof TypeAction];
}