import Image from 'next/image';
import { FunctionComponent, useContext } from 'react';
import imageLoader from '../../api/image-loader';
import UserContext from '../../context/user-context';

const UserPage: FunctionComponent = ({}) => {

    const { currentUser } = useContext(UserContext);

    if(!currentUser) return <p>Kein Benutzer eingeloggt</p>;

    return (
        <div className='flex flex-col '>
            {currentUser.image &&
                <div className='w-1/3 drop-shadow-lg'>
                    <Image
                        src={currentUser.image}
                        alt={currentUser.username}
                        width={200} height={200}
                        loader={imageLoader} unoptimized/>
                </div>}
            <p>{currentUser.username}</p>
            <h2 className="text-2xl text-bold font-mono">Rezepteliste</h2>
            <h2 className="text-2xl text-bold font-mono">Meine Rezepte</h2>
        </div>
    );
};

export default UserPage;