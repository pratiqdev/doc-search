import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getRandArrItem = <T>(array:T[], number:number): T[] => {
  const shuffledArray = array.sort(() => Math.random() - 0.5); // Shuffle the array
  return shuffledArray.slice(0, number); // Get the first 'number' items
};
