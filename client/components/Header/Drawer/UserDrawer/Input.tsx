import { FunctionComponent } from 'react';

interface InputProps {
    type: 'text' | 'password';
    onChange: (value: string) => void;
    value: string;
    title: string;
}

const Input: FunctionComponent<InputProps> = ({ type, onChange, value, title }) => {

    return (
        <div className="px-2 flex justify-between items-center">
            <p>{title}</p>
            <input
                type={ type } onChange={ (e) => onChange(e.target.value) } value={ value }
                // eslint-disable-next-line max-len
                className="p-1 bg-transparent focus:shadow focus:outline-none border-b border-header-text border-dashed"
            />
        </div>
    );
};

export default Input;