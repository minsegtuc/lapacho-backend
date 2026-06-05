export default (sequelize, DataTypes) => {
    const tipoOperativo = sequelize.define('tipoOperativo', {
        idTipoOperativo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {tableName: 'tipoOperativo', timestamps: true, createdAt: 'fechaCreacion', updateAt: 'fechaActualizacion'})

    tipoOperativo.associate = (modelos) => {
        tipoOperativo.hasMany(modelos.Operativo, {foreignKey: 'tipoOperativoId', as: 'operativos'})
        tipoOperativo.hasMany(modelos.Elemento, {foreignKey: 'tipoOperativoId', as: 'elementos'})
    }

    return tipoOperativo;
}