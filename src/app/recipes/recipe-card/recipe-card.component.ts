import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../../../../models/recipe.model';
import { AuthService, UserInfo } from './../../auth/auth.service';


@Component({
	selector: 'app-recipe-card',
	templateUrl: './recipe-card.component.html',
	styleUrls: ['./recipe-card.component.css']
})
export class RecipeCardComponent implements OnInit, OnDestroy {

	@Input('recipe') recipe: Recipe;
	user: UserInfo;
	isBookmarked = false;
	userInfoListener: Subscription;

  	constructor(private authService: AuthService) { }

  	ngOnInit(): void {

		this.user = this.authService.getUser();
		this.isBookmarked = this.user.bookmarks.includes(this.recipe.id || '');
		this.userInfoListener = this.authService.getUserListener().subscribe(user => {
			this.user = user;
			this.isBookmarked = this.user.bookmarks.includes(this.recipe.id || '');
		});
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
