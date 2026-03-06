/*
  Script inicial para SQL Server local (Windows 11)
  Estrutura mínima para o site institucional.
*/

IF DB_ID('FreshworksSite') IS NULL
BEGIN
  CREATE DATABASE FreshworksSite;
END
GO

USE FreshworksSite;
GO

IF OBJECT_ID('dbo.site_settings', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.site_settings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(255) NOT NULL,
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
  );
END
GO

MERGE dbo.site_settings AS target
USING (
  VALUES
    ('site_title', 'Freshworks CRM'),
    ('site_status', 'online'),
    ('site_mode', 'institutional')
) AS source (setting_key, setting_value)
ON target.setting_key = source.setting_key
WHEN MATCHED THEN
  UPDATE SET
    setting_value = source.setting_value,
    updated_at = SYSDATETIME()
WHEN NOT MATCHED THEN
  INSERT (setting_key, setting_value)
  VALUES (source.setting_key, source.setting_value);
GO

SELECT * FROM dbo.site_settings ORDER BY setting_key;
GO
