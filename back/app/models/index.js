const { Sequelize } = require("sequelize"); 
const sequelize = require("../bd/database"); 

const db = {};
db.Sequelize = Sequelize; 
db.sequelize = sequelize;  

db.usuarios = require("./usuario.model")(sequelize); 
db.acoes= require("./acao.model")(sequelize)
db.historicos = require("./historico.model")(sequelize); 

module.exports = db;