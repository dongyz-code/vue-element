/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_KEY: 'default';
  readonly VITE_APP_NODE_ENV: 'development' | 'test' | 'uat' | 'production';
};

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
