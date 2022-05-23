export const BUTTON_KEYS = {
  REFRESH: 'button-refresh',
  CLOSE: 'button-close',
  CALLAPSE: 'button-collapse',
} as const;

export type BUTTON_KEYS = typeof BUTTON_KEYS[keyof typeof BUTTON_KEYS];

export const selectHeaderButton = (wrapper: Element, button: typeof BUTTON_KEYS[keyof typeof BUTTON_KEYS]) => {
  const buttonElement = wrapper.querySelector(`.${button}`);
  return buttonElement as HTMLElement;
}