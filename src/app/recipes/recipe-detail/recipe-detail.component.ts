import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RecipesService } from '../recipes-service/recipes.service';
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
	modalRef: BsModalRef;

  	constructor(
		  private route: ActivatedRoute,
		  private router: Router,
		  private recipesService: RecipesService,
		  private authService: AuthService,
		  private modalService: BsModalService) { }

	ngOnInit(): void {
		this.route.data.subscribe((data: Data) => {
			this.recipe = data['recipe'];
		});
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.userIsCreator = this.authService.getUserId() === this.recipe.userId;
    }

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	openModal(template: TemplateRef<any>): void {
		this.modalRef = this.modalService.show(template);
	}

	removeRecipe(): void {
		this.modalRef.hide();
		const recipeId = this.recipe.id;
		recipeId && this.recipesService.deleteRecipe(recipeId).subscribe(result => {
			
			if(result.message.includes('Deleted')) {
				this.router.navigate(['/']);
			}
		});
	}
}
