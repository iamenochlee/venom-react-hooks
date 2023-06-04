export function checkArgs(args: any[], error: string) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) {
      throw new Error(error);
    }
  }
}
