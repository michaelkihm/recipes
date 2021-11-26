import { AbstractControl } from '@angular/forms';

type ReturnType = { matchPassword: boolean } | null;

export const matchPassword = (control: AbstractControl): ReturnType => {

    const formGroup = control.parent;
    if(formGroup) {
        const password = formGroup.get('password_1');
        const confirmPassword = formGroup.get('password_2');

        if(password && confirmPassword)
            return password.value === confirmPassword.value ? null : { matchPassword: true };
    }
    return null;
};