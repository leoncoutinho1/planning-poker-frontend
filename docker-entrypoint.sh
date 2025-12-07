#!/bin/sh

# Injetar variáveis de ambiente no HTML
export HTML_PATH=/usr/share/nginx/html/index.html
node /usr/local/bin/inject-env.js

# Executar comando original (nginx)
exec "$@"

