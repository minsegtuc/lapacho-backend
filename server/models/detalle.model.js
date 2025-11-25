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
        lapachoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'lapacho',
                key: 'idLapacho'
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
        Detalle.belongsTo(modelos.Lapacho, {foreignKey: 'lapachoId', as: 'lapacho'}),
        Detalle.belongsTo(modelos.Elemento, {foreignKey: 'elementoId', as: 'elemento'})
    }
    return Detalle;
}