import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'models/recipe.model';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

	@Output() removeItemEvent = new EventEmitter<string>();
	@Input('removeBtn') removeBtn: boolean;
	@Input('recipes') recipes: Recipe[];
	constructor(private router: Router) { }

	ngOnInit(): void {

	}

	onClick(recipeId: string | undefined): void {
		
		recipeId && this.router.navigate(['/recipes', recipeId]);
	}

	removeRecipe(event: MouseEvent,recipeId: string | undefined): void {
		
		event.stopPropagation();
		recipeId && this.removeItemEvent.emit(recipeId);
	}

}
