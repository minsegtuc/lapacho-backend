import { ENUM } from "sequelize";

export default (sequelize, DataTypes) => {
    const Puesto = sequelize.define('puesto', {
        idPuesto: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coordenadas:{
            type: DataTypes.STRING,
            allowNull: true
        },
        tipoPuesto:{
            type: DataTypes.ENUM('FRONTERIZO', 'NO OFICIAL'),
            allowNull: false
        }
    }, {tableName: 'puesto', timestamps: true, createdAt: 'fechaCreacion', updateAt: 'fechaActualizacion'})

    Puesto.associate = (modelos) => {
        Puesto.hasMany(modelos.Operativo, {foreignKey: 'puestoId', as: 'operativos'})
    }

    return Puesto;
}