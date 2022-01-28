import { UserAddRequest } from './types';
import { didMulterSaveImage, User, userFormDataToUser } from '@mickenhosrecipes/common';

export const processImageDataAndFormData = (req: UserAddRequest): User => {

    const user = userFormDataToUser(req.body);
    let image = user.image;
    if(didMulterSaveImage(req)){
        const url = `${req.protocol}://${req.get('host')}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image = `${url}/images/${(req as any)?.file?.filename}`;
    }
    
    return { ...user, image };
};