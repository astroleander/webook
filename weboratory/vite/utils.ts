import { readdirSync } from 'fs';
import { CONFIG, ROOT } from '../shared.config';
import { resolve } from 'path';

type GetInputFolderByPrefix = (
  prefix: string, 
  configs?: {
    entryHTML?: string
  }
) => Record<string, string>;

export const getInputFolderByPrefix: GetInputFolderByPrefix = (prefix: string, { entryHTML } = {}) => {
  return readdirSync(ROOT).reduce<Record<string, string>>((obj, name: string) => {
    if (name.startsWith(prefix)) {
      obj[name] = resolve(ROOT, name, entryHTML ?? CONFIG.ENTRY_HTML);
    }
    return obj;
  }, {/* initialValue */})
}

export const input_folders = getInputFolderByPrefix('lab');
