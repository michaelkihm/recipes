import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipesService } from '../recipes-service/recipes.service';
import { Recipe } from './../../../../models/recipe.model';
import { AuthService, UserInfo } from './../../auth/auth.service';

@Component({
	selector: 'app-recipe-detail',
	templateUrl: './recipe-detail.component.html',
	styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {

	userIsAuthenticated = false;
	userIsCreator = false;
	recipe: Recipe;
	@ViewChild('modal') modalRef: ElementRef;
	user: UserInfo;
	isBookmarked = false;
	userInfoListener: Subscription;

  	constructor(
		  private route: ActivatedRoute,
		  private router: Router,
		  private recipesService: RecipesService,
		  private authService: AuthService) { }

	ngOnInit(): void {
		
		this.route.data.subscribe((data: Data) => {
			this.recipe = data['recipe'];
		});
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.userIsCreator = this.authService.getUserId() === this.recipe.userId;
		this.user = this.authService.getUser();
		this.isBookmarked = this.isRecipeBookmarked();
		
		this.userInfoListener = this.authService.getUserListener().subscribe(user => {
			this.user = user;
			this.isBookmarked = this.isRecipeBookmarked();
		});
    }


	openModal(): void {
		
		this.modalRef.nativeElement.style.display = 'block';
	}

	closeModal(): void {

		this.modalRef.nativeElement.style.display = 'none';
	}

	removeRecipe(): void {

		this.closeModal();
		const recipeId = this.recipe.id;
		recipeId && this.recipesService.deleteRecipe(recipeId).subscribe(result => {
			
			if(result.message.includes('Deleted')){
				this.router.navigate(['/']);
			}
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

	isVegan(): boolean {
		return this.recipe.categories.includes('vegan');
	}

	isVegetarian(): boolean {
		return this.recipe.categories.includes('vegetarian') && !this.isVegan();
	}
}
