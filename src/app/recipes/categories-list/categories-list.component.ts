import { Component, OnInit } from '@angular/core';
import { ReceipesService } from '../recipes-service/recipes.service';
import { Category } from './../../../../models/category.type';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  categories: readonly Category[] = [];
  selected: Category[] = [];

  constructor(private recipeService: ReceipesService) { }

  ngOnInit(): void {
    this.categories = this.recipeService.getCategories();
  }

  onSelectCategory(category: Category): void {
    
    const index = this.selected.indexOf(category);
    index > -1 ? this.selected.splice(index) : this.selected.push(category);
    console.log(this.selected);
  }

}
