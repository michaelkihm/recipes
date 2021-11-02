import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'models/recipe.model';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

	@Input('recipes') recipes: Recipe[];
	constructor(private router: Router) { }

	ngOnInit(): void {

	}

	onClick(recipeId: string | undefined): void {
		
		recipeId && this.router.navigate(['/recipes', recipeId]);
	}

}
