import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import helmet from 'helmet';
import methodOverride from 'method-override';
import {MulterError} from 'multer';
import bodyParser from 'body-parser';
import 'express-async-errors';
import session from 'express-session';
import 'dotenv/config';
import { router } from './routes';
//conexao db
import createConnection from './database';
createConnection();
const app = express();
//configurações do express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(methodOverride('_method'));


//configurações da view engine.
app.set('view engine','ejs');
app.set('views',path.join(__dirname, '/views'));

//configurações de segurança
app.use(helmet());
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: Number(process.env.EXPRESS_SESSION_MAXAGE)}
}))

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