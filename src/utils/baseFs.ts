import { join } from '@tauri-apps/api/path';
import { exists, mkdir } from '@tauri-apps/plugin-fs';

export const checkIsBaseInited = async (baseDirPath: string) => {
  const configPath = await join(baseDirPath, '.yafm');
  const isConfigFileExist = await exists(configPath);
  return isConfigFileExist;
};

export const initBase = async (baseDirPath: string, config: object) => {
  const configDirPath = await join(baseDirPath, '.yafm');
  const txsDirPath = await join(baseDirPath, 'transactions');

  const isConfigFileExist = await checkIsBaseInited(baseDirPath);
  if (!isConfigFileExist) {
    await mkdir(configDirPath);
    await mkdir(txsDirPath);
  }
};
