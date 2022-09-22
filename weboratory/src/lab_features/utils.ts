export const __log = (debug: boolean | null | undefined, ...args: any) => {
  if (debug) {
    console.log(...args);
  };
};