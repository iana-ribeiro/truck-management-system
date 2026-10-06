# Truck Management System

Sistema de gestão de carregamentos e check-in de motoristas no pátio. Tem duas partes:

- **Check-in do motorista**: um formulário simples, pensado pra ser usado num tablet na portaria. O motorista informa o carregamento, confere seus dados e os do veículo, concorda com as regras de segurança, e recebe um ticket.
- **Gestão de Carregamentos**: uma tela interna, usada pela equipe do pátio, que mostra todos os carregamentos programados pra hoje e se o motorista de cada um já fez o check-in ou não.

As duas telas são o mesmo site (React), só em rotas diferentes. Quem guarda os dados é um backend próprio (Node/Express), que conversa com dois bancos SQL Server diferentes — veja [Como os dados se conectam](#como-os-dados-se-conectam) mais abaixo.

## Sumário

- [Arquitetura, em resumo](#arquitetura-em-resumo)
- [Pré-requisitos](#pré-requisitos)
- [Instalando para desenvolver](#instalando-para-desenvolver)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rodando com Docker](#rodando-com-docker)
- [Instalando para outra planta/unidade](#instalando-para-outra-plantaunidade)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Problemas comuns](#problemas-comuns)

## Arquitetura, em resumo

```
frontend/   React + Vite — a parte visual (as telas)
backend/    Node + Express — a API que o frontend chama
```

O backend conversa com **dois bancos SQL Server diferentes**, com finalidades bem diferentes:

1. **Banco da empresa (`dbo.vfluxo`)** — já existe, é de **só leitura**. É de onde vem a lista "oficial" dos carregamentos programados pra hoje. O sistema nunca grava nada nele.
2. **Banco `Checkins`** — é nosso, criado só pra este sistema. É onde cada check-in feito por um motorista é gravado.

Toda vez que a tela de Gestão de Carregamentos é aberta, o backend busca as duas listas e as cruza: pega os carregamentos programados (do `vfluxo`) e marca, pedido por pedido, se já existe um check-in correspondente (no banco `Checkins`). É assim que a coluna "Status" sabe dizer "Aguardando check-in" ou "Check-in feito".

## Pré-requisitos

- **Node.js 24** (ou mais novo) — [nodejs.org](https://nodejs.org)
- Acesso de rede aos dois SQL Server (o da empresa e o dedicado aos check-ins) — geralmente precisa estar na rede/VPN da empresa
- **Docker** (opcional) — só necessário se for gerar as imagens pra hospedar, não pra desenvolver no dia a dia

## Instalando para desenvolver

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Abra o `.env` recém-criado e preencha os valores (veja a tabela completa em [Variáveis de ambiente](#variáveis-de-ambiente)). Depois:

```bash
npm start
```

Se tudo estiver certo, o terminal mostra `Servidor rodando em http://localhost:4000` e as mensagens de conexão com os dois bancos.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Preencha o `.env` do frontend — a `VITE_API_KEY` precisa ser **exatamente igual** à `API_KEY` que você colocou no `.env` do backend. Depois:

```bash
npm run dev
```

O terminal mostra o endereço local (geralmente `http://localhost:5173`). Abra esse endereço no navegador:

- `/carregamentos` — tela de Gestão de Carregamentos
- `/checkin` — fluxo de check-in do motorista

### 3. O banco `Checkins`

Esse banco precisa existir antes do backend conseguir gravar os check-ins. Rode o script [backend/database/checkins-schema.sql](backend/database/checkins-schema.sql) uma vez no seu SQL Server (trocando a senha de exemplo antes de rodar). A **tabela** dentro dele é criada automaticamente pelo próprio backend na primeira vez que ele conectar — não precisa criar a tabela na mão.

## Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Pra que serve |
|---|---|
| `API_KEY` | Chave secreta que toda chamada à API precisa mandar (cabeçalho `x-api-key`). Gere um valor longo e aleatório (ex: `openssl rand -hex 32`) — nunca um valor óbvio. |
| `CORS_ORIGIN` | Endereços do frontend autorizados a chamar essa API, separados por vírgula. Em produção, use o domínio real do frontend em vez de `localhost`. |
| `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_DATABASE`, `DB_PORT`, `DB_ENCRYPT` | Acesso ao SQL Server **da empresa** (`dbo.vfluxo`, só leitura). |
| `CHECKINS_DB_USER`, `CHECKINS_DB_PASSWORD`, `CHECKINS_DB_SERVER`, `CHECKINS_DB_DATABASE`, `CHECKINS_DB_PORT`, `CHECKINS_DB_ENCRYPT` | Acesso ao banco `Checkins` (o nosso, onde os check-ins são gravados). |

### Frontend (`frontend/.env`)

| Variável | Pra que serve |
|---|---|
| `VITE_API_URL` | Endereço do backend (ex: `http://localhost:4000` em desenvolvimento). |
| `VITE_API_KEY` | Precisa ser **igual** à `API_KEY` do backend. Como o Vite "cola" esse valor dentro do JavaScript final na hora do build, ele fica visível no DevTools do navegador — essa chave barra acesso oportunista de fora, não substitui um login de verdade. |

**Nunca comite o arquivo `.env`** (já está no `.gitignore`) — só o `.env.example`, sem valores reais.

## Rodando com Docker

Cada parte tem seu próprio `Dockerfile` e é buildada separadamente (não usamos `docker-compose` neste projeto):

```bash
# Backend
cd backend
docker build -t truck-backend .
docker run -p 4000:4000 --env-file .env truck-backend

# Frontend (VITE_API_URL e VITE_API_KEY precisam existir NESSE momento,
# porque o Vite "cola" esses valores dentro do JS já na hora do build —
# diferente das credenciais do backend, que só entram ao RODAR o container)
cd frontend
docker build -t truck-frontend \
  --build-arg VITE_API_URL=https://endereco-real-do-backend \
  --build-arg VITE_API_KEY=mesma-chave-do-backend \
  .
docker run -p 8080:80 truck-frontend
```

Em produção (Kubernetes, etc.), as credenciais do backend (`DB_*`, `CHECKINS_DB_*`, `API_KEY`) são passadas como Secret/variáveis de ambiente do container — nunca ficam gravadas dentro da imagem.

## Instalando para outra planta/unidade

O sistema já foi pensado pra outras plantas da empresa usarem, mas hoje **uma coisa fica fixa no código**, não numa variável de ambiente: qual planta e qual tipo de frete aparecem na lista de carregamentos. Isso está em [backend/services/carregamentosService.mssql.js](backend/services/carregamentosService.mssql.js):

```sql
WHERE planta = 'G. TATUI'
  AND Frete = 'DAP'
  AND CAST(Programado AS DATE) = CAST(GETDATE() AS DATE)
```

Pra colocar o sistema no ar pra outra planta, hoje é preciso:

1. Trocar o valor `'G. TATUI'` (e `'DAP'`, se o tipo de frete também mudar) nesse arquivo.
2. Gerar uma imagem Docker separada com essa mudança (ou manter um branch próprio por planta).
3. Cada planta tem seu próprio deploy, com seu próprio `.env` — mas todas podem compartilhar o mesmo banco da empresa (`dbo.vfluxo`), já que o filtro de planta é o que separa os dados de cada uma.

> Se isso virar uma necessidade frequente (várias plantas rodando o mesmo sistema), vale transformar `planta` e `Frete` em variáveis de ambiente, do mesmo jeito que `DB_*` já funciona — aí não precisaria mais editar código nem gerar uma imagem por planta.

## Estrutura de pastas

```
backend/
  controllers/     recebe o pedido HTTP e devolve a resposta
  routes/          define os endereços da API (/carregamentos, /checkins)
  services/        quem conversa de fato com os bancos SQL Server
  database/        configuração de conexão com os dois bancos
  middleware/       a trava de autenticação por API_KEY

frontend/
  src/pages/        as telas (Carregamentos, Checkin)
  src/components/   peças visuais reutilizáveis (tabela, cards, modais)
  src/services/     quem conversa com a API do backend
```

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Erro 401 em qualquer chamada | `VITE_API_KEY` (frontend) e `API_KEY` (backend) estão diferentes, ou o header não foi enviado. |
| Erro de CORS no navegador | O endereço do frontend não está listado em `CORS_ORIGIN`, no `.env` do backend. |
| Backend sobe mas não conecta no banco | Confira `DB_SERVER`/`CHECKINS_DB_SERVER`, e se sua máquina está na rede/VPN certa. O servidor fica de pé mesmo com o banco fora do ar — mas toda chamada à API vai dar erro 500 até a conexão voltar. |
| Tela de Gestão de Carregamentos sempre vazia | O filtro de planta/data em `carregamentosService.mssql.js` pode não bater com o que existe no `vfluxo` pra hoje — confira se a planta configurada é a certa. |
