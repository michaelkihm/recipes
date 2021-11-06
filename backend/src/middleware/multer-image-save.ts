import multer from 'multer';

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

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        
        const isValid = getMimeType(file.mimetype);
        let error: Error | null = new Error('Invalid Mime type');
        if(isValid) error = null;
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = getMimeType(file.mimetype);
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});


export const multerMiddleware = multer({ storage }).single('image');
