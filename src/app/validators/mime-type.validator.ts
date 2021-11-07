import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReturnType = { [key: string]: any } | null;

export const mimeType = (control: AbstractControl): Promise<ReturnType> | Observable<ReturnType> => {

  	if (typeof(control.value) === 'string') return of(null);
  
	const file = control.value as File;
	const fileReader = new FileReader();
	const frObs = new Observable((observer: Observer<ReturnType>) => {
		fileReader.addEventListener('loadend', () => {
			const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
			let header = '';
			let isValid = false;
			for (let i = 0; i < arr.length; i++) header += arr[i].toString(16);
			switch (header) {
				case '89504e47':
					isValid = true;
					break;
				case 'ffd8ffe0':
				case 'ffd8ffe1':
				case 'ffd8ffe2':
				case 'ffd8ffe3':
				case 'ffd8ffe8':
					isValid = true;
					break;
				default:
					isValid = false; // Or you can use the blob.type as fallback
					break;
			}
			if (isValid) observer.next(null);
			else observer.next({ invalidMimeType: true });
			
			observer.complete();
		});

		fileReader.readAsArrayBuffer(file);
	});
	
	return frObs;
};