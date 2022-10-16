export const __log = (debug: boolean | null | undefined, ...args: any) => {
  if (debug) {
    console.log(...args);
  };
};

export const rudeDarkMode = () => {
  if (new Date().getHours() >= 21 || new Date().getHours() < 6) {
    document.documentElement.style.backgroundColor = '#212121';
    document.documentElement.style.color = '#EEE';
  }
}