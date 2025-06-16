import { invoke } from '@tauri-apps/api/core';
import { join } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { FC, useLayoutEffect, useState } from 'react';

import { useStore } from '#utils/store';

const HomePage: FC = () => {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const store = useStore();

  useLayoutEffect(() => {
    store.get<string>('selectedFolder').then((value) => {
      if (!value) return;
      setSelectedFolder(value);
      loadFiles(value);
    });
  }, [store]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('greet', { name }));
  }

  async function pickFolder() {
    const folder = await open({
      directory: true,
      multiple: false,
    });

    if (typeof folder === 'string') {
      console.log('Выбранная папка:', folder);
      setSelectedFolder(folder);
      store.set('selectedFolder', folder);
    }
  }

  // Загрузка файлов из папки
  const loadFiles = async (folderPath: string) => {
    try {
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
      console.error('Ошибка чтения папки:', e);
    }
  };

  const createFile = async () => {
    if (!selectedFolder) return;
    const now = new Date();
    const iso = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const filePath = await join(selectedFolder, `${iso}.txt`);
    await writeTextFile(filePath, now.toISOString());
    await loadFiles(selectedFolder);
  };

  return (
    <>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>

      <button type="button" onClick={pickFolder}>
        Choose folder
      </button>
      <p>
        <b>Your folder:</b> {selectedFolder}
      </p>
      <button onClick={createFile} disabled={!selectedFolder} type="button">
        Создать файл с датой
      </button>
      <h3>Файлы в папке:</h3>
      <ul>
        {files.map((f) => (
          <li key={f.name}>
            {f.name} - {f.content}
          </li>
        ))}
      </ul>
    </>
  );
};

export default HomePage;
