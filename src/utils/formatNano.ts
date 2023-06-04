export function formatNano(value: string | number, decimal?: number) {
  const parsedValue = typeof value === "string" ? parseFloat(value) : value;
  return (parsedValue / 10 ** (decimal || 9)).toString();
}
