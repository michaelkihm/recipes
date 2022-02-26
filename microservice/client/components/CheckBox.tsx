import { FunctionComponent } from 'react';

interface CheckBoxProps {
    checked: boolean;
    onClick: () => void;
    sizeRem: number;
}

const CheckBox: FunctionComponent<CheckBoxProps> = ({ checked, onClick, sizeRem }) => {

    return (
        <div onClick={onClick}>
            {checked && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={`${sizeRem}rem`}>
                    <title>Checkmark Circle</title>
                    <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                        fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"/>
                    <path
                        fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"
                        d="M352 176L217.6 336 160 272"/>
                </svg>
            }
            {!checked && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={`${sizeRem}rem`}>
                    <title>Ellipse</title>
                    <circle cx="256" cy="256" r="192"
                        fill="none" stroke="currentColor" 
                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
                </svg>
            }
        </div>
    );
};

export default CheckBox;