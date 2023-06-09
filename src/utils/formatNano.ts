/**
 * Formats a value in nano units to a more human-readable format.
 * Formats to venom by default
 * @param value - The value in nano units.
 * @param decimal - The number of decimal places to include (default: 9).
 * @returns The formatted value as a string.
 * @example
 * const nanoValue = "500000000";
 * const formattedValue = formatNano(nanoValue);
 * console.log(formattedValue); // "0.5"
 */
export function formatNano(value: string | number, decimal?: number): string {
  const parsedValue = typeof value === "string" ? parseFloat(value) : value;
  const decimalPlaces = decimal || 9;
  return (parsedValue / 10 ** decimalPlaces).toString();
}
