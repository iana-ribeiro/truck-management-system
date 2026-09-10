# Imagem do backend (API Express). Não precisa compilar nada nativo —
# tanto o mssql/tedious (SQL Server) quanto o resto das dependências são
# JavaScript puro, por isso uma imagem "alpine" (bem enxuta) já basta.
FROM node:22-alpine

WORKDIR /app

# Copia só os arquivos de dependência primeiro, antes do resto do
# código. Assim, o Docker só reinstala os pacotes (passo mais lento)
# quando o package.json muda — se só o código da aplicação mudar, essa
# camada fica "em cache" e o build fica bem mais rápido.
COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Porta que o server.js usa (veja PORT em server.js).
EXPOSE 4000

# As credenciais do banco (CHECKINS_DB_*, DB_*) NÃO vão aqui — elas são
# passadas na hora de RODAR o container (--env-file, docker-compose, ou
# um Secret do Kubernetes), nunca dentro da imagem. Veja a pergunta que
# você fez sobre isso: o Dockerfile é igual com ou sem credencial.
CMD ["npm", "start"]
