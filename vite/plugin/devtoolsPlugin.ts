import { PluginOption } from 'vite';

export const getDevtoolsPlugin = (mode: string): PluginOption => ({
  name: 'inject-react-devtools',
  transformIndexHtml(html) {
    if (mode !== 'development') return;

    return {
      html,
      tags: [
        {
          tag: 'script',
          attrs: { src: 'http://localhost:8097' },
          injectTo: 'head',
        },
      ],
    };
  },
});
