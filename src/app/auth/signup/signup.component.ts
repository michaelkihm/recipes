import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { AuthService } from './../auth.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

	constructor(private authService: AuthService) { }
	userForm: FormGroup;
	imagePreview: string | undefined;

	ngOnInit(): void {

		this.userForm = new FormGroup({
			'email': new FormControl('', Validators.required),
			'username': new FormControl('',Validators.required),
			'password': new FormControl('',Validators.required),
			'image': new FormControl('',{ asyncValidators: [mimeType] })
		});
	}

	onSubmit(): void {

		if(this.userForm.invalid) return;
		this.authService.createUser(this.userFormToFormData());

	}

	userFormToFormData(): FormData {

		const values = this.userForm.value;
		const userData = new FormData();

		userData.append('email',values.email);
		userData.append('username',values.username);
		userData.append('password',values.password);
		userData.append('image',values.image);

		return userData;
	}

	onImagePicked(event: Event): void {

		if(!event || !event.target ) return;
		const target = event.target as HTMLInputElement;
		if(!target.files ) return;
		
		const file = target.files[0];
		this.userForm.patchValue({ image: file });
		this.userForm.get('image')?.updateValueAndValidity();
		const reader = new FileReader();
		reader.onload = () => this.imagePreview = reader.result as string;
		reader.readAsDataURL(file);
	}
}
