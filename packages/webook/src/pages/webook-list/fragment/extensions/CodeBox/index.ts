import styles from './style.module.css';

export const createCodeBox = (props: {
  source: string;
}) => {
  console.log(styles);
  const container = document.createElement('aside');
  const code = document.createElement('pre');
  code.className = styles.pre;
  code.innerHTML = props.source;
  container.appendChild(code);
  return container;
}