import { UserDoc } from '@mickenhosrecipes/common';
import React, { FunctionComponent } from 'react';


export interface CurrentUser {
	currentUser: UserDoc | null;
}

interface Context extends CurrentUser {
    isUserLoggedIn: () => boolean;

}

const UserContext = React.createContext<Context>({
    currentUser: null,
    isUserLoggedIn: () => false,
});

export const UserContextProvider: FunctionComponent<CurrentUser> = ({ children, currentUser }) => {

    const isUserLoggedIn = () => currentUser !== null;

    return <UserContext.Provider value={{ currentUser, isUserLoggedIn }}>{children}</UserContext.Provider>;
};

export default UserContext;