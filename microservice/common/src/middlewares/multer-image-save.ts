import { Request } from 'express';
import multer from 'multer';
import { BadRequestError } from '..';

const getMimeType = (type: string) => {

    const MIME_TYPE_MAP: {[key:string]: string} = {
        'image/png': 'png',
        'image/jpeg': 'png',
        'image/jpg': 'jpg'
    };

    if(type in MIME_TYPE_MAP){
        return MIME_TYPE_MAP[type];
    } else return '';
};

const getStorage = (dirName: string) => multer.diskStorage({

    destination: (req, file, cb) => {
        
        const isValid = getMimeType(file.mimetype);
        let error: Error | null = new BadRequestError('Invalid Mime type');
        if(isValid) error = null;
        cb(error, dirName);
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = getMimeType(file.mimetype);
        cb(null, `${name}-${Date.now()}.${ext}`);
    }
});


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const multerMiddleware = ( imageDir: string ) =>
    multer({ storage:  getStorage(imageDir) }).single('image');


export const didMulterSaveImage = (req: Request) => req?.file?.filename ? true : false;