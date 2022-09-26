import { readdirSync } from 'fs';
import { CONFIG, PAGE_FOLDER, ROOT } from '../shared.config';
import { resolve, join } from 'path';

type GetInputFolder = (
  configs?: {
    path: string
    entryHTML?: string
  }
) => Record<string, string>;

export const getInputFolder: GetInputFolder = ({ path, entryHTML } = { path: 'pages' }) => {
  return readdirSync(join(ROOT, path)).reduce<Record<string, string>>((obj, name: string) => {
    obj[name] = resolve(ROOT, path, name, entryHTML ?? CONFIG.ENTRY_HTML);
    return obj;
  }, {/* initialValue */})
}

export const input_folders = getInputFolder({ path: PAGE_FOLDER});
