const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Historico = sequelize.define('Historico', {
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
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: 'historico',
    });

    Historico.associate = (models) => {
        Historico.belongsTo(models.Usuario, {
            foreignKey: 'usuarioId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Historico;
};
