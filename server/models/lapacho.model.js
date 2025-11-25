export default (sequelize, DataTypes) => {
    const Lapacho = sequelize.define('Lapacho', {
        idLapacho: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        periodo: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

    }, { tableName: 'lapacho', timestamps: true, createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' })
    Lapacho.associate = (modelos) => {
        Lapacho.hasMany(modelos.Detalle, { foreignKey: 'lapachoId', as: 'detalles' })
    }
    return Lapacho;
}