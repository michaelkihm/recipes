import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Recipe } from './../../../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

	recipe: Recipe;

  	constructor(private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.route.data.subscribe((data: Data) => {
			this.recipe = data['recipe'];
		});
    }
}
