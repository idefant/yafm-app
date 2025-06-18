import { zodResolver } from '@hookform/resolvers/zod';
import { join } from '@tauri-apps/api/path';
import { readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { FC, useCallback, useLayoutEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

import { routes } from '#data/routes';
import { useAppDispatch, useAppSelector } from '#hooks/reduxHooks';
import Cryptor from '#modules/Cryptor';
import { accountGroupsReceived } from '#store/reducers/accountGroupsSlice';
import { accountsReceived } from '#store/reducers/accountsSlice';
import { clearFolderPath, unlockBase } from '#store/reducers/appSlice';
import { categoriesReceived } from '#store/reducers/categoriesSlice';
import { setCommits } from '#store/reducers/commitsSlice';
import { currenciesReceived, setMainCurrency } from '#store/reducers/currenciesSlice';
import { templatesReceived } from '#store/reducers/templatesSlice';
import { transactionsReceived } from '#store/reducers/transactionsSlice';
import { Commit, CommitAction, updatedBaseMethods } from '#types/commitType';
import { Alert } from '#ui/Alert';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { dmodal } from '#ui/Modal';
import { HStack } from '#ui/Stack';
import { Title } from '#ui/Typography';
import { committer } from '#utils/committer';
import { compileBase } from '#utils/compileBase';
import { useTauriStore } from '#utils/tauriStore';

const formSchema = z.object({
  password: z.string().nonempty(),
});

type FormOutput = z.infer<typeof formSchema>;

type EncryptedCommit = {
  id: string;
  cipher: string;
  iv: string;
  hmac: string;
  salt: string;
  userId: string;
  syncedAt: string;
};

const DecryptBasePage: FC = () => {
  const dispatch = useAppDispatch();
  const { folderPath } = useAppSelector((state) => state.app);

  const navigate = useNavigate();

  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [alertText, setAlertText] = useState<string>();

  const tauriStore = useTauriStore();

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const loadFiles = useCallback(async (folderPath: string) => {
    try {
      console.log('=== folderPath', folderPath);
      const entries = await readDir(folderPath);
      const onlyFiles = entries.filter((e) => e.name && e.isFile);
      const filesWithContent = await Promise.all(
        onlyFiles.map(async (e) => {
          const filePath = await join(folderPath, e.name);
          const content = await readTextFile(filePath);
          return { name: e.name, content };
        }),
      );
      setFiles(filesWithContent);
    } catch (e) {
      dmodal.error({
        title: 'Ошибка чтения папки',
        content: 'Подробности для отладки в консоли',
        showCancel: false,
      });
      console.error('Ошибка чтения папки:', e);
    }
  }, []);

  useLayoutEffect(() => {
    if (!folderPath) return;

    (async () => {
      const txsFolder = await join(folderPath, 'transactions');
      await loadFiles(txsFolder);
      setIsLoadingFiles(false);
    })();
  }, [folderPath, loadFiles, tauriStore]);

  const onSubmit = async (values: FormOutput) => {
    setAlertText(undefined);

    const decryptedCommits: Commit[] = [];

    const commits: EncryptedCommit[] = files.map((file) => JSON.parse(file.content));

    await Cryptor.setSecret({ password: values.password, salt: commits[0].salt });

    for await (const commit of commits.toReversed()) {
      const decryptedCommit = await committer.decrypt(commit);

      if (!decryptedCommit) {
        setAlertText('Wrong password');
        reset({ password: '' });
        return;
      }

      // XXX: Тут должна быть проверка на целостность типа
      const updatedBaseActionIndex = decryptedCommit.actions.findIndex(({ action }) =>
        updatedBaseMethods.some((method) => method === action.method),
      );

      if (updatedBaseActionIndex !== -1) {
        decryptedCommits.push({
          createdAt: decryptedCommit.date,
          actions: decryptedCommit.actions
            .slice(updatedBaseActionIndex)
            .map(({ action }) => action) as CommitAction[],
        });
        break;
      }
      decryptedCommits.push({
        createdAt: decryptedCommit.date,
        actions: decryptedCommit.actions.map(({ action }) => action) as CommitAction[],
      });
    }

    const base = compileBase(decryptedCommits.toReversed());
    if (!base) {
      dmodal.error({
        title: 'Invalid base data',
        showCancel: false,
      });
      return;
    }

    dispatch(unlockBase());
    dispatch(currenciesReceived(base.currencies));
    dispatch(setMainCurrency(base.mainCurrencyCode));
    dispatch(accountGroupsReceived(base.accountGroups));
    dispatch(accountsReceived(base.accounts));
    dispatch(categoriesReceived(base.categories));
    dispatch(templatesReceived(base.templates));
    dispatch(transactionsReceived(base.transactions));
    dispatch(
      setCommits(
        decryptedCommits.map((commit) => ({
          createdAt: commit.createdAt,
          actions: commit.actions,
        })),
      ),
    );

    navigate(routes.dashboard);
  };

  const chooseAnotherFolder = () => {
    dispatch(clearFolderPath());
    tauriStore.delete('selectedFolder');
  };

  if (isLoadingFiles) {
    return 'Loading...';
  }

  return (
    <>
      <Title level={4} gutterBottom>
        Decrypt Base
      </Title>

      <button type="button" onClick={chooseAnotherFolder}>
        Choose another base
      </button>

      <Alert text={alertText} />

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Password name="password" label="Password:" autoFocus />

          <HStack justify="center">
            <Button type="submit">Decrypt</Button>
          </HStack>
        </Form>
      </FormProvider>
    </>
  );
};

export default DecryptBasePage;
