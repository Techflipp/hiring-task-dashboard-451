import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Helper function to combine and merge CSS classes using clsx and tailwind-merge.
 * Useful for conditionally applying and merging Tailwind CSS classes.
 *
 * @param {...ClassValue[]} inputs - The class values to combine and merge.
 * @returns {string} The merged string of class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string or Date object into a human-readable format.
 * The format is typically like "MMM D, YYYY, h:mm A" based on 'en-US' locale options.
 *
 * @param {string | Date} date - The date string or Date object to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Truncates a string if it exceeds a specified maximum length, adding an ellipsis (...) at the end.
 *
 * @param {string} text - The input string to truncate.
 * @param {number} maxLength - The maximum length of the string before truncation occurs.
 * @returns {string} The truncated string with ellipsis, or the original string if it's within the limit.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Generates initials from a full name string.
 * It takes the first character of the first two words and converts them to uppercase.
 *
 * @param {string} name - The full name string (e.g., "John Doe").
 * @returns {string} The uppercase initials (e.g., "JD"). Returns an empty string if the name is empty or has no words.
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Creates a new URL search parameters string by updating an existing one with provided parameters.
 * Allows adding, updating, or deleting parameters based on the `params` object.
 *
 * @param {object} options - The options object containing initial search parameters and updates.
 * @param {string} options.searchParams - The initial search parameters string (e.g., from `location.search`).
 * @param {Record<string, string | number | null>} options.params - An object containing parameter updates.
 *   - If a value is a string or number, the parameter is set or updated.
 *   - If a value is `null`, the parameter is deleted.
 * @returns {string} The updated search parameters string.
 */
export const createQueryString = ({
  searchParams = '',
  params,
}: {
  searchParams?: string
  params: Record<string, string | number | null>
}): string => {
  const newParams = new URLSearchParams(searchParams)

  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      newParams.delete(key)
    } else {
      newParams.set(key, String(value))
    }
  }

  return newParams.toString()
}
