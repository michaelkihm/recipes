import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-vegetarian-icon',
	templateUrl: './vegetarian-icon.component.html',
	styleUrls: ['./vegetarian-icon.component.scss']
})
export class VegetarianIconComponent implements OnInit {

	@Input('size') size: string = '1';
	constructor() { }

	ngOnInit(): void { }
}
