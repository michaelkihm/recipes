import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../../../../models/recipe.model';
import { AuthService, UserInfo } from './../../auth/auth.service';


@Component({
	selector: 'app-recipe-card',
	templateUrl: './recipe-card.component.html',
	styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit, OnDestroy {

	@Input('recipe') recipe: Recipe;
	user: UserInfo;
	isBookmarked = false;
	userInfoListener: Subscription;

  	constructor(private authService: AuthService) { }

  	ngOnInit(): void {

		this.user = this.authService.getUser();
		this.isBookmarked = this.isRecipeBookmarked();
		this.userInfoListener = this.authService.getUserListener().subscribe(user => {
			this.user = user;
			this.isBookmarked = this.isRecipeBookmarked();
		});
	}

	private isRecipeBookmarked(): boolean {

		const bookmarks = this.user.bookmarks;
		if(!bookmarks) return false;
		return bookmarks.includes(this.recipe.id || '');
	}

	onBookmark(event: Event): void {
		event.stopPropagation();
		const recipeId = this.recipe.id;
		recipeId && this.authService.upateBookmarks(recipeId, this.isBookmarked ? 'remove' : 'add');
	}

	ngOnDestroy(): void {

		this.userInfoListener && this.userInfoListener.unsubscribe();
	}

}
