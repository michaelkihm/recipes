import { FunctionComponent } from 'react';
import { IconBaseProps } from './icon-base-props';

const AddIcon: FunctionComponent<IconBaseProps> = ({ onClick, sizeRem, disabled }) => {

    return (
        <button type="button" onClick={ onClick } disabled={ disabled } className="disabled:opacity-disabled">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={ `${sizeRem}rem` }>
                <title>Add</title>
                <path fill="none" stroke="currentColor"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 112v288M400 256H112" />
                </svg>
        </button>
    );
};

export default AddIcon;