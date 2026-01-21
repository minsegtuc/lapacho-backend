import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv'
import cors from 'cors';
import http from 'http';
import cookieParser from "cookie-parser";
import sequelize from "./config/database.js";
import "./models/index.model.js"; // Importar modelos para que Sequelize los registre
import routes from './routes/index.routes.js'

dotenv.config()

const app = express();
const port = process.env.port || 3012;
const allowedOrigins = ['https://control.minsegtuc.gov.ar', 'http://127.0.0.1:5500'];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
};

app.set('trust proxy', 1)
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use('/apiOperativo', routes)

sequelize.authenticate()
    .then(() => {
        console.log('conexión exitosa a la base de datos')
        return sequelize.sync({})
    })
    .then(()=>{
        const server = http.createServer(app)
        server.listen(port,()=>{
            console.log(`servidor en puerto: ${port}`)
        })
    })
    .catch(error=>console.error(`error al conectarse a la base de datos: ${error}`))