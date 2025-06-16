import { open } from '@tauri-apps/plugin-dialog';
import { FC, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '#data/routes';
import { useAppDispatch } from '#hooks/reduxHooks';
import { setFolderPath } from '#store/reducers/appSlice';
import { checkIsBaseInited } from '#utils/baseFs';
import { useTauriStore } from '#utils/tauriStore';

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

  const pickFolder = async () => {
    const path = await open({ directory: true, multiple: false });
    if (typeof path !== 'string') return;

    dispatch(setFolderPath(path));
    tauriStore.set('selectedFolder', path);

    const isBaseInited = await checkIsBaseInited(path);
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
