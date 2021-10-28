import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Recipe } from './../../../../models/recipe.model';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

	userIsAuthenticated = false;
	userIsCreator = false;
	recipe: Recipe;

  	constructor(private route: ActivatedRoute, private authService: AuthService) { }

	ngOnInit(): void {
		this.route.data.subscribe((data: Data) => {
			this.recipe = data['recipe'];
		});
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.userIsCreator = this.authService.getUserId() === this.recipe.userId;
    }
}
