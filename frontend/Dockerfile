# Imagem do frontend. Tem DUAS etapas ("multi-stage build"):
#
# 1. "build": usa o Node só pra transformar o código React em arquivos
#    estáticos prontos (a pasta dist/ que já vimos sendo gerada com
#    "npm run build") — o mesmo processo que já testamos várias vezes.
# 2. Etapa final: pega SÓ esses arquivos prontos e serve com o nginx, um
#    servidor feito pra isso. O Node/React/node_modules inteiros ficam
#    pra trás, na etapa anterior — a imagem final não carrega esse peso.

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# VITE_API_URL precisa existir agora, na hora do build — diferente de
# uma variável de ambiente comum, o Vite "cola" esse valor dentro do
# JavaScript final durante a compilação. Se ela só existisse quando o
# container roda (como as credenciais do banco no backend), seria tarde
# demais: o arquivo já estaria pronto sem ela.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Mesma lógica do VITE_API_URL acima: precisa ser passada como ARG de
# build, não como env de runtime. Precisa ser IGUAL à API_KEY configurada
# no backend/.env (veja backend/middleware/apiKeyAuth.js), senão todo
# pedido do frontend pro backend volta 401.
ARG VITE_API_KEY
ENV VITE_API_KEY=$VITE_API_KEY

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
