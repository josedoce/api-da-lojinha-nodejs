import multer from 'multer';
import {Request} from 'express';
import path from 'path';

interface callback {
    (error: Error | null, destination: string):void
}

const storage = multer.diskStorage({
    destination: function(req: Request, file:Express.Multer.File, cb:callback){
        cb(null, 'public/uploads/images/');
    },
    filename: function(req: Request, file: Express.Multer.File, cb: callback){
        
        const nomeArquivo: string = 'imagem'+Date.now()+path.extname(file.originalname);
        cb(null, nomeArquivo);
        
    }
});

const uploadImgs = multer({
    storage,
    limits: {
        fileSize: 1024*1024 //unidade em byte,
    },
    fileFilter:  function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
});

export {uploadImgs};