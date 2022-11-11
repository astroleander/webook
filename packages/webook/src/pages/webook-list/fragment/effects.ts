export const effects = {
  recordTimestamp: () => {
    const start = window?.performance.now();
    return () => (window?.performance.now() - start).toFixed(2) + 'ms'
  }
}