/* eslint-disable max-len */
import { FunctionComponent } from 'react';
import { IconBaseProps } from './icon-base-props';

const UserAccountIcon: FunctionComponent<IconBaseProps> = ({ onClick, sizeRem, disabled }) => {

    return (
        <button onClick={ onClick } disabled={ disabled } className="disabled:opacity-disabled">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"width={ `${sizeRem}rem` } >
                <title>Open</title>
                <path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48M336 64h112v112M224 288L440 72"
                    fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
            </svg>
        </button>
    );
};

export default UserAccountIcon;