import { FunctionComponent } from 'react';
import { IconBaseProps } from './icon-base-props';


const CloseIcon: FunctionComponent<IconBaseProps> = ({ onClick, sizeRem, className }) => {

    return (
        <button onClick={onClick} className={className}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={`${sizeRem}rem`}>
                <title>Close</title>
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"
                    d="M368 368L144 144M368 144L144 368"/>
            </svg>
        </button>
    );
};

export default CloseIcon;