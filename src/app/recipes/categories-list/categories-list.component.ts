import { Component, OnInit } from '@angular/core';
import { ReceipesService } from '../recipes-service/recipes.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  categories: readonly string[] = [];
  constructor(private recipeService: ReceipesService) { }

  ngOnInit(): void {
    this.categories = this.recipeService.getCategories();
  }

}
