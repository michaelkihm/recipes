import { Component, OnInit } from '@angular/core';
import { Recipe } from 'models/recipe.model';
import { AuthService, UserInfo } from './../auth/auth.service';
import { RecipesService } from './../recipes/recipes-service/recipes.service';

@Component({
	selector: 'app-userpage',
	templateUrl: './userpage.component.html',
	styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {

	myRecipes: Recipe[];
	user: UserInfo;

	constructor(private recipesService: RecipesService, private authService: AuthService) { }

	ngOnInit(): void {

		this.user = this.authService.getUser();
		if(this.user) {
			this.recipesService.fetchRecipes(this.user.userId).subscribe(recipes => {
				this.myRecipes = recipes;
			});
		}
	}

}
