import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'

async function conectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.blue.bold('Conexión exitosa a la DB'));
    } catch (error) {
        console.log(colors.red.bold('Fallo la conexión a la DB'));
    }
}
conectDB();

const app = express()

app.use(morgan('dev'))

app.use(express.json())



export default app