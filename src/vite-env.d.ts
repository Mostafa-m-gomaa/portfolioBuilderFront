/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_META_PIXEL_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
