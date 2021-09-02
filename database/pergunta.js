const Sequelize = require("sequelize");
const connection = require("./database");

//tabela que será criada
const Pergunta = connection.define("perguntas", {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

//sincronização da tabela, se ela existir naõ serforçada uma nova criação
Pergunta.sync({force: false}).then(() =>{})

module.exports = Pergunta
