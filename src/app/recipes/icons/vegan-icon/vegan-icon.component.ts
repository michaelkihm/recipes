import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-vegan-icon',
	templateUrl: './vegan-icon.component.html',
	styleUrls: ['./vegan-icon.component.scss']
})
export class VeganIconComponent implements OnInit {

	@Input('size') size: string = '1';
	constructor() { }

	ngOnInit(): void { }
}
