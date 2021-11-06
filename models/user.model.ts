import { HasKeys } from './common.type';

export interface User {
    email: string;
    password: string;
    username?: string;
    id?: string;
    bookmarks?: string[];
    image?: string;
}

export type UserStrings = HasKeys<User>;

export const userFormDataToUser = (formData: UserStrings): User => {

    const bookmarks = formData.bookmarks ? JSON.parse(formData.bookmarks) as string[] : [];

    return {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        id: formData.id,
        bookmarks,
        image: formData.image,
    };
};