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

-- Table where every completed check-in is stored (see
-- backend/services/checkinsService.js, which inserts and reads these
-- exact columns). "id" auto-increments and is also the base for the
-- ticket number (CRG-000X); "created_at" is what
-- carregamentosService.cruzado.js uses as the driver's arrival time.
CREATE TABLE checkins (
    id INT IDENTITY(1,1) PRIMARY KEY,
    load_number NVARCHAR(20) NOT NULL,
    client NVARCHAR(200) NULL,
    carrier NVARCHAR(200) NULL,
    driver_name NVARCHAR(200) NOT NULL,
    driver_cpf NVARCHAR(20) NOT NULL,
    driver_cnh NVARCHAR(20) NULL,
    driver_phone NVARCHAR(20) NOT NULL,
    vehicle_plate NVARCHAR(10) NOT NULL,
    operation_type NVARCHAR(50) NOT NULL,
    vehicle_type NVARCHAR(50) NOT NULL,
    requirements_accepted BIT NOT NULL,
    safety_accepted BIT NOT NULL,
    ticket NVARCHAR(20) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO
