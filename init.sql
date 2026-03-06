/*
  Script inicial para SQL Server local (Windows 11)
  Execute no SSMS conectado à sua instância local.
*/

IF DB_ID('AdvocaciaOperacional') IS NULL
BEGIN
  CREATE DATABASE AdvocaciaOperacional;
END
GO

USE AdvocaciaOperacional;
GO

IF OBJECT_ID('dbo.integrations_status', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.integrations_status (
    id INT IDENTITY(1,1) PRIMARY KEY,
    integration_key VARCHAR(60) NOT NULL UNIQUE,
    integration_name VARCHAR(120) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    pending_tasks INT NOT NULL DEFAULT 0,
    last_sync DATETIME2 NULL,
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
  );
END
GO

MERGE dbo.integrations_status AS target
USING (
  VALUES
    ('datajud', 'DataJud', 'Consulta e monitoramento processual nacional', 'planned', 3),
    ('freshdesk', 'Freshdesk', 'Atendimento e tickets internos/externos', 'planned', 6),
    ('freshworks', 'Freshworks CRM', 'Gestão de relacionamento com clientes e oportunidades', 'planned', 9),
    ('advise', 'Advise', 'Inteligência jurídica e suporte estratégico', 'planned', 12)
) AS source (integration_key, integration_name, purpose, status, pending_tasks)
ON target.integration_key = source.integration_key
WHEN MATCHED THEN
  UPDATE SET
    integration_name = source.integration_name,
    purpose = source.purpose,
    status = source.status,
    pending_tasks = source.pending_tasks,
    updated_at = SYSDATETIME()
WHEN NOT MATCHED THEN
  INSERT (integration_key, integration_name, purpose, status, pending_tasks, last_sync)
  VALUES (source.integration_key, source.integration_name, source.purpose, source.status, source.pending_tasks, DATEADD(DAY, -1, SYSDATETIME()));
GO

SELECT * FROM dbo.integrations_status ORDER BY integration_name;
GO
