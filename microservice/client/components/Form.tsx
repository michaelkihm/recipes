import { ErrorResponse } from '@mickenhosrecipes/common';
import { FormEvent, FunctionComponent } from 'react';

interface FormProps {
    onSubmit: (event: FormEvent) => void;
    title: string;
    errors: ErrorResponse
    className?: string;
}

const Form: FunctionComponent<FormProps> = ({ onSubmit, title, children, errors, className }) => {
   
    return (
        <form className={className} onSubmit={onSubmit}>
            <h1 className="text-xl text-bold underline">{title}</h1>
            {children}
            {errors.length > 0 && <div className='mt-2 px-1 bg-danger'>
                <h4 className='underline'>something went wrong</h4>
                {errors.map(err => <p key={err.message}>{err.message}</p>)}
            </div>}
            <button type="submit" className="p-1 my-2 bg-blue-400 text-white hover:bg-blue-200 rounded shadow m-1">
                {title}
            </button>
        </form>
    );
};

export default Form;