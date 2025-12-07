#!/usr/bin/env node

/**
 * Script para injetar variáveis de ambiente no HTML em runtime
 * Usado no Docker para permitir configuração via variáveis de ambiente
 */

const fs = require('fs');
const path = require('path');

// No Docker, o HTML está em /usr/share/nginx/html
// Em desenvolvimento, está em dist/
const htmlPath = process.env.HTML_PATH || 
  (fs.existsSync('/usr/share/nginx/html/index.html') 
    ? '/usr/share/nginx/html/index.html'
    : path.join(__dirname, 'dist', 'index.html'));

if (!fs.existsSync(htmlPath)) {
  console.error(`Arquivo index.html não encontrado em ${htmlPath}`);
  process.exit(1);
}

// Ler variáveis de ambiente
const apiUrl = process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:3000';
const socketUrl = process.env.VITE_SOCKET_URL || process.env.SOCKET_URL || apiUrl;

// Criar objeto de configuração
const config = {
  apiUrl,
  socketUrl,
};

// Ler o HTML
let html = fs.readFileSync(htmlPath, 'utf8');

// Injetar script de configuração antes do fechamento do </head>
const configScript = `
  <script>
    window.__APP_CONFIG__ = ${JSON.stringify(config)};
  </script>
`;

// Verificar se já existe o script de configuração
if (html.includes('window.__APP_CONFIG__')) {
  // Substituir configuração existente
  html = html.replace(
    /<script>\s*window\.__APP_CONFIG__\s*=.*?<\/script>/s,
    configScript.trim()
  );
} else {
  // Adicionar antes do fechamento do </head>
  html = html.replace('</head>', `${configScript}</head>`);
}

// Escrever o HTML modificado
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('Variáveis de ambiente injetadas:');
console.log('  API_URL:', apiUrl);
console.log('  SOCKET_URL:', socketUrl);

