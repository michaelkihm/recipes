import { ErrorResponse } from '@mickenhosrecipes/common';
import { FormEvent, FunctionComponent } from 'react';

interface FormProps {
    onSubmit: (event: FormEvent) => void;
    title: string;
    errors: ErrorResponse
}

const Form: FunctionComponent<FormProps> = ({ onSubmit, title, children, errors }) => {

    return (
        <form className="p-4 m-2 border-2 rounded border-text-header overflow-y-auto" onSubmit={onSubmit}>
            <h1 className="text-xl text-bold underline">{title}</h1>
            {children}
            {errors.length > 0 && <div className='bg-red-400'>
                <h4 className='underline'>something went wrong</h4>
                {errors.map(err => <p key={err.message}>{err.message}</p>)}
            </div>}
            <button className="p-1 my-2 bg-blue-400 text-white hover:bg-blue-200 rounded shadow m-1">
                {title}
            </button>
        </form>
    );
};

export default Form;