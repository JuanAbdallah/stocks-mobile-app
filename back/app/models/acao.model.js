const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Acao = sequelize.define('Acao', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        valor: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        simbolo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: 'acoes',
    });

    Acao.associate = (models) => {
        Acao.belongsTo(models.Usuario, {
            foreignKey: 'usuarioId',  
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Acao;
};
