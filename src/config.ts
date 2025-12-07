// Configuração de runtime para variáveis de ambiente
// As variáveis são injetadas no HTML antes de servir

interface AppConfig {
  apiUrl: string;
  socketUrl: string;
}

function getConfig(): AppConfig {
  // Tenta ler do window (injetado pelo script de entrypoint)
  const windowConfig = (window as any).__APP_CONFIG__;
  if (windowConfig) {
    return windowConfig;
  }

  // Fallback para variáveis de ambiente do Vite (build time)
  return {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  };
}

export const config = getConfig();

