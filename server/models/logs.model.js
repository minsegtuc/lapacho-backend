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
        userName:{
            type: DataTypes.STRING(100)
        },
        userAgent: {
            type: DataTypes.STRING(100)
        },
        ip:{
            type: DataTypes.STRING(20)
        }
    }, { tableName: 'logs', timestamps: true, createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' })

    return Logs;
}