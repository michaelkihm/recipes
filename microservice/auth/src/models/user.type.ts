
export interface User {
    email: string;
    password: string;
    username: string;
    image?: string;
}


type HasKeys<T> = {
  [P in keyof T]: string
};


export type UserStrings = HasKeys<User>;

export const userFormDataToUser = (formData: UserStrings): User => {

    return {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        image: formData.image,
    };
};
  