import { join } from '@tauri-apps/api/path';
import { exists, mkdir } from '@tauri-apps/plugin-fs';

export const checkIsBaseInited = async (baseDirPath: string) => {
  const configPath = await join(baseDirPath, 'yafm-config');
  // console.log('=== before await exists .yafm');
  const isConfigFileExist = await exists(configPath);
  // console.log('=== after await exists .yafm', isConfigFileExist);
  return isConfigFileExist;
};

export const initBase = async (baseDirPath: string) => {
  const configDirPath = await join(baseDirPath, 'yafm-config');
  const txsDirPath = await join(baseDirPath, 'transactions');

  const isConfigFileExist = await checkIsBaseInited(baseDirPath);
  if (!isConfigFileExist) {
    await mkdir(configDirPath, { recursive: true });
    await mkdir(txsDirPath, { recursive: true });
  }
};
