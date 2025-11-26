export default (sequelize, DataTypes) => {
    const Logs = sequelize.define('Logs', {
        idLog: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        accion:{
            type: DataTypes.STRING(100)
        },
        descripcion:{
            type: DataTypes.STRING(255)
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dniId:{
            type: DataTypes.INTEGER
        }
    }, { tableName: 'logs', timestamps: true, createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' })

    return Logs;
}