import { open } from '@tauri-apps/plugin-dialog';
// import { request } from '@tauri-apps/plugin-permission';
import { FC, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '#data/routes';
import { useAppDispatch } from '#hooks/reduxHooks';
import { setFolderPath } from '#store/reducers/appSlice';
import { checkIsBaseInited, initBase } from '#utils/baseFs';
import { useTauriStore } from '#utils/tauriStore';
import { BaseDirectory, homeDir, join } from '@tauri-apps/api/path';
import { mkdir, writeTextFile } from '@tauri-apps/plugin-fs';

const ChooseFolderPage: FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const tauriStore = useTauriStore();

  useLayoutEffect(() => {
    (async () => {
      const folderPath = await tauriStore.get<string>('selectedFolder');
      if (!folderPath) return;

      const isBaseInited = await checkIsBaseInited(folderPath);
      if (!isBaseInited) return;

      dispatch(setFolderPath(folderPath));
    })();
  }, [dispatch, tauriStore]);

  const pickFolderOld = async () => {
    // const res = await request('android.permission.WRITE_EXTERNAL_STORAGE');
    // const path = await join(await homeDir(), 'yafm');
    // const path = await join('$HOME/Android/media/com.yafm.app/first/second/third');
    const path = '/storage/emulated/0/Android/media/com.yafm.app/first/second/third';
    await mkdir(path, { recursive: true });

    await writeTextFile('/storage/emulated/0/Android/media/com.yafm.app/test.txt', 'hello idefant');
    // const path = await open({ directory: true, multiple: false });
    // if (typeof path !== 'string') return;

    // dispatch(setFolderPath(path));
    // tauriStore.set('selectedFolder', path);

    await initBase(path);

    // const isBaseInited = await checkIsBaseInited(path);
    // console.log('=== isBaseInited', isBaseInited);

    // navigate(isBaseInited ? routes.decryptBase : routes.createBase);
  };

  const pickFolder = async () => {
    // INFO: Можно работать с ФС только внутри /storage/emulated/0/Android/media/com.yafm.app.
    //       В корне пользовательской папки (/storage/emulated/0/) создать ничего не удалось - Permission Denied.
    //       Остальные папки я не проверял.
    //       В media/com.yafm.app нельзя создавать папки/файлы начинающиеся с точки !!! - Permission Denied.
    //       К папке media могут иметь доступ другие приложения. Например, SyncThing.
    //       В Android нельзя использовать плагин @tauri-apps/plugin-dialog для выбора папки (на текущий момент).
    //       Я не нашел в Tauri в принципе функционала для вызова Storage Access Framework (SAF).
    //       В функции pickFolderOld указаны примеры создания папок/файлов.
    //
    //       Запуск в dev-режиме для ПК:      `npm run tauri dev`
    //       Сборка для ПК:                   `npm run tauri build`
    //       Запуск в dev-режиме для android: `npm run tauri android dev`
    //       Сборка для android:              `npm run tauri android build`
    //
    //       Для установки приложения необходимо подписать APK файл.
    //
    //       Подпись вручную:
    //       # 1. Создай или укажи существующий ключ
    //       keytool -genkey -v -keystore release.keystore -alias yafmkey -keyalg RSA -keysize 2048 -validity 10000
    //
    //       # 2. Подпиши APK
    //       apksigner sign --ks release.keystore --out app-release-signed.apk app-universal-release-unsigned.apk
    //
    //       После этого можно установить приложение на телефон.
    //       В Tauri можно настроить автоматическую подпись APK при сборке.

    // const path = await open({ directory: true, multiple: false });
    const path = '/storage/emulated/0/Android/media/com.yafm.app';
    // if (typeof path !== 'string') return;

    dispatch(setFolderPath(path));
    tauriStore.set('selectedFolder', path);

    const isBaseInited = await checkIsBaseInited(path);
    console.log('=== isBaseInited', isBaseInited);
    navigate(isBaseInited ? routes.decryptBase : routes.createBase);
  };

  return (
    <div>
      <h1>Choose Folder</h1>
      <button type="button" onClick={pickFolder}>
        Choose folder
      </button>
    </div>
  );
};

export default ChooseFolderPage;
