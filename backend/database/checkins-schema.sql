-- checkins-schema.sql
--
-- Script de UMA VEZ SÓ, pra rodar manualmente no SQL Server (alguém com
-- permissão de administrador/DBA, geralmente não é a mesma permissão que
-- o próprio sistema usa no dia a dia). Cria o banco de dados dedicado
-- aos check-ins.
--
-- Depois que o banco existir, NÃO É PRECISO rodar mais nada aqui: a
-- tabela "checkins" é criada sozinha, automaticamente, na primeira vez
-- que o backend conectar (veja database/connection.checkins.mssql.js).
--
-- Troque "Checkins" abaixo pelo nome que fizer mais sentido pra vocês —
-- só lembrando de usar o MESMO nome na variável CHECKINS_DB_DATABASE
-- do arquivo .env.

CREATE DATABASE Checkins;
