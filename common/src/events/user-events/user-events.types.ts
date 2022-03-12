export type UserEventData = {
    version: number;
    userId: string;
    user: UserEvent;
};

export type UserEvent = {
    username: string;
    email: string;
    image: string;
};