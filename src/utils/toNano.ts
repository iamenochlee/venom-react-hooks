export function toNano(value: string | number) {
  const parsedValue = typeof value === "string" ? parseFloat(value) : value;
  return (parsedValue * 10 ** 9).toString();
}
