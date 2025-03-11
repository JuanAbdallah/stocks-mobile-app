const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        nomeUsuario: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        saldo: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            allowNull: false,
        },
        avaliacao: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        timestamps: true,
        tableName: 'usuarios',
    });

    Usuario.associate = (models) => {
        Usuario.hasMany(models.Acao, {
            foreignKey: 'usuarioId',  
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE', 
        });
        Usuario.hasMany(models.Historico, {
            foreignKey: 'usuarioId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };
    

    return Usuario;
};
