import { exists } from '@tauri-apps/plugin-fs';
import { useLayoutEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { routes } from '#data/routes';
import { useAppDispatch, useAppSelector } from '#hooks/reduxHooks';
import { AccountGroups } from '#pages/AccountGroups';
import { Accounts } from '#pages/Accounts';
import { Categories } from '#pages/Categories';
import ChooseFolderPage from '#pages/ChooseFolderPage';
import { Commits } from '#pages/Commits';
import CreateBasePage from '#pages/CreateBasePage';
import { Currencies } from '#pages/Currencies';
import { Dashboard } from '#pages/Dashboard';
import DecryptBasePage from '#pages/DecryptBasePage';
import { Setting } from '#pages/Setting';
import { Templates } from '#pages/Templates';
import { Transactions } from '#pages/Transactions';
import { setFolderPath } from '#store/reducers/appSlice';
import { BaseTemplate } from '#templates/BaseTemplate';
import { CabinetTemplate } from '#templates/CabinetTemplate';
import { checkIsBaseInited } from '#utils/baseFs';
import { useTauriStore } from '#utils/tauriStore';

const App = () => {
  const dispatch = useAppDispatch();
  const { isBaseUnlocked, folderPath } = useAppSelector((state) => state.app);

  const tauriStore = useTauriStore();

  useLayoutEffect(() => {
    (async () => {
      const dirPath = await tauriStore.get<string>('selectedFolder');
      if (!dirPath) return;
      const isExistDirPath = await exists(dirPath);
      if (!isExistDirPath) return;

      const isInited = await checkIsBaseInited(dirPath);
      if (isInited) {
        dispatch(setFolderPath(dirPath));
        return;
      }
    })();
  }, [dispatch, tauriStore]);

  const routesList = useMemo(() => {
    if (!folderPath) {
      return (
        <Route element={<CabinetTemplate />}>
          <Route path={routes.chooseBaseFolder} element={<ChooseFolderPage />} />
          <Route path={routes.notFound} element={<Navigate to={routes.chooseBaseFolder} />} />
        </Route>
      );
    }

    if (!isBaseUnlocked) {
      return (
        <Route element={<CabinetTemplate />}>
          <Route path={routes.createBase} element={<CreateBasePage />} />
          <Route path={routes.uploadBase} element="Upload Base" />
          <Route path={routes.decryptBase} element={<DecryptBasePage />} />
          <Route path={routes.notFound} element={<Navigate to={routes.decryptBase} />} />
        </Route>
      );
    }

    return (
      <Route element={<BaseTemplate />}>
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.transactions} element={<Transactions />} />
        <Route path={routes.accounts} element={<Accounts />} />
        <Route path={routes.accountGroups} element={<AccountGroups />} />
        <Route path={routes.settings} element={<Setting />} />
        <Route path={routes.templates} element={<Templates />} />
        <Route path={routes.categories} element={<Categories />} />
        <Route path={routes.currencies} element={<Currencies />} />
        <Route path={routes.commits} element={<Commits />} />
        <Route path={routes.notFound} element={<Navigate to={routes.dashboard} />} />
      </Route>
    );
  }, [folderPath, isBaseUnlocked]);

  return <Routes>{routesList}</Routes>;
};

export default App;
