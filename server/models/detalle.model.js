export default (sequelize, DataTypes) => {
    const Detalle = sequelize.define('detalle', {
        idDetalle: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cantidad:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        operativoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'operativo',
                key: 'idOperativo'
            }
        },
        elementoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'elemento',
                key: 'idElemento'
            }
        }

    }, {tableName: 'detalle', timestamps: true, createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion'})
    
    Detalle.associate = (modelos) => {
        Detalle.belongsTo(modelos.Operativo, {foreignKey: 'operativoId', as: 'operativo'}),
        Detalle.belongsTo(modelos.Elemento, {foreignKey: 'elementoId', as: 'elemento'})
    }
    return Detalle;
}