/**
 * Checks if the provided arguments are truthy values.
 * If any argument is falsy, it throws an error with the specified message.
 * @param args - An array of arguments to check.
 * @param error - The error message to throw if any argument is falsy.
 * @throws {Error} - Throws an error with the specified message if any argument is falsy.
 * @example
 * checkArgs([arg1, arg2, arg3], "All arguments must be provided");
 */
export function checkArgs(args: any[], error: string) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) {
      throw new Error(error);
    }
  }
}
