const Sequelize = require("sequelize");
// incluindo a conexao com o banco de dados
const db = require("./db");

// criando a tabela e sua colunas
const User = db.define("users", {
  id:
  {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name:
  {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email:
  {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password:
  {
    type: Sequelize.STRING
  }
});

// criar a tabela
// User.sync();

// verificar se ha alguma diferenca na tabela, realiza a alteracao
// User.sync({ alter: true });

module.exports = User;