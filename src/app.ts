import express, {Request, Response, NextFunction} from 'express';
import helmet from 'helmet';
import {MulterError} from 'multer';
import 'express-async-errors';
import 'dotenv/config';
import { router } from './routes';
import createConnection from './database';
import cors from 'cors';

//conexao db
createConnection();

const app = express();

//configurações do express
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


//configurações de segurança
app.use(helmet());

//limpe listaNegra

//rotas
app.use(router);

app.use((err: Error, req: Request, res: Response, _next: NextFunction)=>{
    if(err instanceof MulterError){
        return res.status(400).json({
            erro: err.code,
            neste_recurso: err.field
        })        
    }
    
    return res.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    })
})

export {app};