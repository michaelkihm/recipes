import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../../models/recipe.model';
import { ReceipesService } from './recipes-service/recipes.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  	recipes: Recipe[];
	constructor(private recipesService: ReceipesService) { }

  	ngOnInit(): void {
		this.recipesService.fetchRandomRecipes().subscribe(recipesResponse => {
			this.recipes = recipesResponse.recipes;
		});
	}

}
