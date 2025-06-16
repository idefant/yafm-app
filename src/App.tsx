import { exists } from '@tauri-apps/plugin-fs';
import { load } from '@tauri-apps/plugin-store';
import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'wouter';

import { routes } from '#data/routes';
import { decrementCounter, incrementCounter } from '#store/reducers/appSlice';
import { checkIsBaseInited, initBase } from '#utils/baseFs';

import Header from './Header';

const store = await load('store.json');

const App = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const dispatch = useDispatch();
  const { counter } = useSelector((state) => (state as any).app);

  useLayoutEffect(() => {
    (async () => {
      const dirPath = await store.get<string>('selectedFolder');
      if (!dirPath) return;
      const isExistDirPath = await exists(dirPath);
      if (!isExistDirPath) {
        setSelectedFolder(null);
        return;
      }

      // XXX: dirPath должен записываться в redux state
      //      setSelectedFolder Удалить
      setSelectedFolder(dirPath);

      const isInited = await checkIsBaseInited(dirPath);
      if (isInited) {
        navigate(routes.decryptBase);
        return;
      }

      // XXX: Инициализация должна производиться прямо перед первым tx
      //      (на странице создания базы, после введения пароля)
      await initBase(dirPath, { inited__DELETE_ME: true });
      navigate(routes.createBase);
    })();
  }, [navigate]);

  return (
    <main>
      <Header />

      <div>Count: {counter}</div>
      <button type="button" onClick={() => dispatch(decrementCounter())}>
        -
      </button>
      <button type="button" onClick={() => dispatch(incrementCounter())}>
        +
      </button>

      <Switch>
        <Route path={routes.chooseBaseDir}>Choose dir</Route>
        <Route path={routes.createBase}>Create base</Route>

        {/* XXX: Нужно будет сделать возможность выбрать другую базу перейдя на страницу chooseBaseDir */}
        <Route path={routes.decryptBase}>Decrypt base</Route>
        <Redirect to={routes.chooseBaseDir} />
      </Switch>
    </main>
  );
};

export default App;
