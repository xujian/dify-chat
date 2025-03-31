import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isJson(str: string) {
  const input = str.trim()
  if (!input) {
    return false
  }

  if (!(
    (input.startsWith('{') && input.endsWith('}')) ||
    (input.startsWith('[') && input.endsWith(']'))
  )) {
    return false
  }

  try {
    JSON.parse(str)
    return true
  }
  catch (e) {
    return false
  }
}

export function toJson(str: string) {
  const input = str.trim()
  if (!input) {
    return null
  }

  if (!(
    (input.startsWith('{') && input.endsWith('}')) ||
    (input.startsWith('[') && input.endsWith(']'))
  )) {
    return null
  }

  try {
    return JSON.parse(str)
  }
  catch (e) {
    return null
  }
}