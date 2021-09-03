const Sequelize = require("sequelize");
const connection = require("./database");

const Resposta = connection.define('respostas',{
    corpo:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId:{
        //relacionamento de forma mais simples
        type: Sequelize.INTEGER,
        allowNull:false
    }
})

Resposta.sync({force: false})

module.exports = Resposta