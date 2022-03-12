import { ErrorResponse } from '@mickenhosrecipes/common';
import { FunctionComponent } from 'react';

const ErrorDialog: FunctionComponent<{ errors: ErrorResponse }> = ({ errors }) => {

    return (
        <div className="mt-2 px-1 bg-danger">
            <h4 className="underline">something went wrong</h4>
            {errors.map(err => <p key={ err.message }>{err.message}</p>)}
        </div>);
};

export default ErrorDialog;