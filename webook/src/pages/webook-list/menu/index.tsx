export const initMenu = (props: {
  __debug: boolean;
  menuElement: Element | null;
}) => {
  if (!props.menuElement) { return; }

  props.menuElement.append('menu');

};
