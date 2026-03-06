// Configuração de conexão com SQL Server local
// Edite os valores conforme necessário
module.exports = {
  user: 'sa', // usuário padrão do SQL Server
  password: 'sua_senha_aqui', // coloque sua senha
  server: 'localhost', // ou o nome da instância
  database: 'AdvocaciaOperacional',
  options: {
    encrypt: false, // true para Azure
    trustServerCertificate: true // necessário para desenvolvimento local
  }
};
