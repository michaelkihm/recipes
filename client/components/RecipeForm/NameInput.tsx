import { FunctionComponent } from 'react';
import { inputStyle } from './form-styles';

const NameInput: FunctionComponent<{ value: string; onChange: (value: string) => void}> = ({ value, onChange }) => {

    return (
        <input
            className={ `${inputStyle} text-2xl ` }
            placeholder="Name" value={ value } onChange={ e => onChange(e.target.value) } />
    );
};

export default NameInput;