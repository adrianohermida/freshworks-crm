// Script Node.js para executar comandos SQL no SQL Server local
// Instale a dependência: npm install mssql

const sql = require('mssql');
const config = require('./sqlserver.config');
const fs = require('fs');

async function runSqlScript(scriptPath) {
  const script = fs.readFileSync(scriptPath, 'utf8');
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().batch(script);
    console.log('Script executado com sucesso!');
    console.log(result);
    await pool.close();
  } catch (err) {
    console.error('Erro ao executar script:', err);
  }
}

// Caminho do script SQL a ser executado
const scriptPath = process.argv[2] || 'init.sql';
runSqlScript(scriptPath);
