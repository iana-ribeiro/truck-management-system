CREATE DATABASE Checkins;
GO

-- REPLACE the password below with a strong password before running.
CREATE LOGIN checkins_app WITH PASSWORD = 'REPLACE_THIS_PASSWORD';
GO

USE Checkins;
GO

CREATE USER checkins_app FOR LOGIN checkins_app;
GO

ALTER ROLE db_datareader ADD MEMBER checkins_app;
ALTER ROLE db_datawriter ADD MEMBER checkins_app;
ALTER ROLE db_ddladmin ADD MEMBER checkins_app;
GO
