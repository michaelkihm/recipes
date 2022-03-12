import React, { FunctionComponent } from 'react';

type BtnStyles = 'danger' | 'black' | 'white' | 'blue';
// eslint-disable-next-line max-len
export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, React.AriaAttributes {
    color: BtnStyles;
}

const btnStyles: {[key in BtnStyles]: string} = {
    danger: 'bg-danger text-white',
    black: 'bg-stone-800 text-white',
    white: 'bg-white text-black border border-black',
    blue: 'bg-blue-400 text-white',
};


const Button: FunctionComponent<ButtonProps> = (props) => {

    const { children, color, className, ...rest } = props;

    return (
        <button {...rest}
            className={`min-h-7 p-1 flex items-center justify-center rounded shadow ${btnStyles[color]} ${className}`}>
                {children}
        </button>);
};

export default Button;