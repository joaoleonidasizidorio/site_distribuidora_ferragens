import { mergeConfig } from 'vite';

export default (config) => {
  return mergeConfig(config, {
    server: {
      host: '0.0.0.0',
      port: 5173,
      hmr: {
        clientPort: 5173,
      },
    },
  });
};
