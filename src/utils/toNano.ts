/**
 * Converts a value to its equivalent in nano units.
 * @param value - The value to be converted.
 * @returns The value in nano units as a string.
 * @example
 * const value = "0.5";
 * const nanoValue = toNano(value);
 * console.log(nanoValue); // "500000000"
 */
export function toNano(value: string | number): string {
  const parsedValue = typeof value === "string" ? parseFloat(value) : value;
  return (parsedValue * 10 ** 9).toString();
}
