/**
 * Date utility functions for the Oxford 3000 vocabulary learning app
 */

/**
 * Get current date in ISO string format
 */
export function getCurrentISOString(): string {
  return new Date().toISOString();
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Add days to a date and return in YYYY-MM-DD format
 */
export function addDaysToDate(date: string, days: number): string {
  const targetDate = new Date(date);
  targetDate.setDate(targetDate.getDate() + days);
  return targetDate.toISOString().split('T')[0];
}

/**
 * Add days to current date and return in YYYY-MM-DD format
 */
export function addDaysToToday(days: number): string {
  return addDaysToDate(getCurrentDateString(), days);
}

/**
 * Check if a date string is today or in the past
 */
export function isDateTodayOrPast(dateString: string): boolean {
  const today = getCurrentDateString();
  return dateString <= today;
}
