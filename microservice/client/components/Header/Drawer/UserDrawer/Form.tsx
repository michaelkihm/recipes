import { FormEvent, FunctionComponent } from 'react';

interface FormProps {
    onSubmit: (event: FormEvent) => void;
    title: string
}

const Form: FunctionComponent<FormProps> = ({ onSubmit, title, children }) => {

    return (
        <form className="p-4 m-2 border-2 rounded border-text-header" onSubmit={onSubmit}>
            <h1 className="text-xl text-bold underline">{title}</h1>
            {children}
            <button className="p-1 my-2 bg-blue-400 text-white  hover:bg-blue-200 rounded shadow m-1">
                {title}
            </button>
        </form>
    );
};

export default Form;