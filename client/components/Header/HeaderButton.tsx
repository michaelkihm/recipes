import { FunctionComponent } from 'react';

const HeaderButton: FunctionComponent<{ onClick: () => void}> = ({ onClick, children }) => {

    return (
        <button
            onClick={ onClick }
            className="py-1 px-6 text-header-text border rounded shadow active:bg-white active:opacity-20">
                {children}
        </button>
    );
};

export default HeaderButton;