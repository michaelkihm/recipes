import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes-service/recipes.service';
import { Category } from './../../../../models/category.type';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
	
	categories: readonly Category[] = [];
  	selected: Category[] = [];

	constructor(private recipeService: RecipesService) { }

	ngOnInit(): void {
		
		this.categories = this.recipeService.getCategories();
	}

	onSelectCategory(category: Category): void {
		
		const index = this.selected.indexOf(category);
		index > -1 ? this.selected.splice(index,1) : this.selected.push(category);
	}

}
