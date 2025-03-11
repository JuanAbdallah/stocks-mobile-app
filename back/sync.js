const sequelize = require('./app/bd/database'); 
const Usuario = require('./app/models/usuario.model')(sequelize); 
const Acao = require('./app/models/acao.model')(sequelize); 
const Historico = require("./app/models/historico.model")(sequelize)
Usuario.associate({ Acao, Historico });
Acao.associate = (models) => {
    Acao.belongsTo(models.Usuario, {
        foreignKey: {
            allowNull: false,
        },
    });
    Historico.associate = (models) => {
      Historico.belongsTo(models.Usuario, {
          foreignKey: {
              allowNull: false,
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      });
  };
};

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); 
    console.log('Banco de dados sincronizado!');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  }
};

syncDatabase();