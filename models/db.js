const Sequelize = require("sequelize");

// conexão com o banco de dados
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql"
});

sequelize.authenticate()
  .then(function () {
    console.log("Connection to the database successfully completed!!");
  }).catch(function () {
    console.log("ERROR: Database connection not performed successfully completed!!");
  });

module.exports = sequelize;
