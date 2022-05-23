import { resolve } from 'path';

// [noted] once root be setted, output should be setted too
export const ROOT = resolve(__dirname, 'src');
export const OUT_DIR = resolve(__dirname, 'dist');

export const CONFIG: Record<string, string> = {
  ENTRY_HTML: 'index.html',
};