/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SOCKET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Declaração global para configuração injetada em runtime
declare global {
  interface Window {
    __APP_CONFIG__?: {
      apiUrl: string;
      socketUrl: string;
    };
  }
}



