import { didMulterSaveImage, User, userFormDataToUser } from '@mickenhosrecipes/common';
import { UserAddRequest } from './types';

export const processImageDataAndFormData = (req: UserAddRequest): User => {

    const user = userFormDataToUser(req.body);
    let image = user.image;
    if(didMulterSaveImage(req)){
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image = `/api/users/images/${(req as any)?.file?.filename}`;
    }
    
    return { ...user, image: image || undefined };
};