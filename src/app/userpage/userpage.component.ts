import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from 'models/recipe.model';
import { Subscription } from 'rxjs';
import { AuthService, UserInfo } from './../auth/auth.service';
import { RecipesService } from './../recipes/recipes-service/recipes.service';

@Component({
	selector: 'app-userpage',
	templateUrl: './userpage.component.html',
	styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit, OnDestroy {

	myRecipes: Recipe[];
	myBookmarks: Recipe[];
	user: UserInfo;
	userInfoListener: Subscription;

	constructor(private recipesService: RecipesService, private authService: AuthService) { }

	ngOnInit(): void {

		this.user = this.authService.getUser();
		this.updateMyRecipesAndBookmarks(this.user);
		
		this.userInfoListener = this.authService.getUserListener().subscribe(user => {
			this.updateMyRecipesAndBookmarks(user);
		});
	}

	updateMyRecipesAndBookmarks(user: UserInfo): void {

		if(user) {
			this.recipesService.fetchRecipes(user.userId).subscribe(recipes => {
				this.myRecipes = recipes;
			});
			this.recipesService.fetchRecipes('', user.bookmarks).subscribe(recipes => {
				this.myBookmarks = recipes;
			});
		}
	}

	removeFromBookmark(recipeId: string): void {
		this.authService.upateBookmarks(recipeId, 'remove');
	}

	ngOnDestroy(): void {
		this.userInfoListener && this.userInfoListener.unsubscribe();
	}

}
