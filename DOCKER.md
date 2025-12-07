# Docker Setup - Planning Poker Frontend

## Problema: Porta 80 já está ocupada

Se você está recebendo o erro de que a porta 80 já está ocupada, você tem algumas opções:

### Opção 1: Usar uma porta diferente (Recomendado)

O arquivo `docker-compose.yml` já está configurado para usar a porta **8080** por padrão. Você pode:

1. **Usar a porta 8080** (já configurada):
   ```bash
   docker compose up -d
   ```
   A aplicação estará disponível em `http://seu-vps:8080`

2. **Alterar para outra porta**:
   Edite o arquivo `docker-compose.yml` e altere a linha:
   ```yaml
   ports:
     - "8080:80"  # Altere 8080 para a porta desejada, ex: "3000:80"
   ```

### Opção 2: Verificar o que está usando a porta 80

No seu VPS, execute:

```bash
# Verificar qual processo está usando a porta 80
sudo lsof -i :80
# ou
sudo netstat -tulpn | grep :80
# ou
sudo ss -tulpn | grep :80
```

### Opção 3: Parar o serviço que está usando a porta 80

Se for um servidor web (nginx, apache, etc), você pode:

```bash
# Para nginx
sudo systemctl stop nginx
sudo systemctl disable nginx  # Para não iniciar automaticamente

# Para apache
sudo systemctl stop apache2
sudo systemctl disable apache2
```

### Opção 4: Usar a porta 80 com docker-compose

Se você quiser usar a porta 80 mesmo assim, edite o `docker-compose.yml`:

```yaml
ports:
  - "80:80"
```

Mas certifique-se de que nenhum outro serviço está usando a porta 80.

## Comandos úteis

```bash
# Subir os containers
docker compose up -d

# Ver logs
docker compose logs -f

# Parar os containers
docker compose down

# Rebuild da imagem
docker compose build --no-cache

# Ver containers rodando
docker ps

# Verificar se a porta está em uso
sudo lsof -i :8080
```

## Configuração de Proxy Reverso (Nginx no Host)

Se você quiser usar a porta 80 no host mas manter o container na 8080, configure um proxy reverso:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

