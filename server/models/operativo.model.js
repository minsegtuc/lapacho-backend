export default (sequelize, DataTypes) => {
    const Operativo = sequelize.define('Operativo', {
        idOperativo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        periodo: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        tipoOperativoId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tipoOperativo',
                key: 'idTipoOperativo'
            },
            puestoId:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'puesto',
                    key: 'idPuesto'
                }
            }
        }
    }, { tableName: 'operativo', timestamps: true, createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' })
    Operativo.associate = (modelos) => {
        Operativo.hasMany(modelos.Detalle, { foreignKey: 'operativoId', as: 'detalles' }),
        Operativo.belongsTo(modelos.tipoOperativo, {foreignKey: 'tipoOperativoId', as: 'tipoOperativo'})
        Operativo.belongsTo(modelos.Puesto, {foreignKey: 'puestoId', as: 'puesto'})
    }
    return Operativo;
}