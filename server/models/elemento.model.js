export default (sequelize, DataTypes) => {
    const Elemento = sequelize.define('elemento', {
        idElemento: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        uMedida: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

    }, { tableName: 'elemento', timestamps: true, createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' })

    Elemento.associate = (modelos) => {
        Elemento.hasOne(modelos.Detalle, { foreignKey: 'elementoId', as: 'detalle' })
    }
    return Elemento;
}