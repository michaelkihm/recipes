import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ALL_CATEGORIES, Category } from 'models/category.type';
import { ALL_INGREDIENT_UNITS } from 'models/ingredient.model';
import { ALL_DURATION_UNITS, Recipe } from 'models/recipe.model';
import { Duration } from './../../../../models/recipe.model';
import { RecipesService } from './../recipes-service/recipes.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

	recipe: Recipe;
	recipeForm: FormGroup;
	imagePreview: string | undefined;
	durationUnits = ALL_DURATION_UNITS;
	ingredientUnits = ALL_INGREDIENT_UNITS;
	allowedCategories = ALL_CATEGORIES;

	constructor(private route: ActivatedRoute, private router: Router, private recipesService: RecipesService) { }

	ngOnInit(): void {
		this.route.data.subscribe((data: Data) => {
			this.recipe = data['recipe'];
		});
		this.recipeForm = new FormGroup({
			'name': new FormControl(this.recipe.name, Validators.required),
			'duration': new FormGroup({
				'durationValue': new FormControl(this.recipe.duration.duration,Validators.required),
				'durationUnit': new FormControl(this.recipe.duration.unit,Validators.required)
			}),
			'description': new FormArray(
								this.recipe.description.map(step => new FormControl(step, Validators.required))),
			'ingredients': new FormArray(this.populateIngredients()),
			'categories': new FormArray(this.recipe.categories.map(category => new FormControl(category))),
			'image': new FormControl(this.recipe.image, { asyncValidators: [mimeType] })
		});
		this.imagePreview = this.recipe.image as string;
	}

	onAddDescriptionStep(): void {
		const control = new FormControl(null, Validators.required);
		(this.recipeForm.get('description') as FormArray).push(control);
	}

	getDescriptionSteps(): AbstractControl[] {
		return (this.recipeForm.get('description') as FormArray).controls;
	}

	onRemoveDescriptionStep(index: number): void{
		(this.recipeForm.get('description') as FormArray).removeAt(index);
	}

	private populateIngredients() {
		return this.recipe.ingredients.map(ingredient =>
			new FormGroup({
				'name': new FormControl(ingredient.name, Validators.required),
				'amount': new FormControl(ingredient.amount, Validators.required),
				'unit': new FormControl(ingredient.unit, Validators.required),
			})
		);
	}

	onAddIngredient(): void {
		const group = new FormGroup({
				'name': new FormControl(null, Validators.required),
				'amount': new FormControl(null, Validators.required),
				'unit': new FormControl('pieces', Validators.required)
		});
		(this.recipeForm.get('ingredients') as FormArray).push(group);
	}

	getIngredients(): AbstractControl[] {
		return (this.recipeForm.get('ingredients') as FormArray).controls;
	}

	onRemoveIngredient(index: number): void {
		(this.recipeForm.get('ingredients') as FormArray).removeAt(index);
	}

	onCheckboxChange(e: Event): void {

		const checkArray: FormArray = this.recipeForm.get('categories') as FormArray;
		const isChecked = (e.target as HTMLInputElement).checked;
		const value = (e.target as HTMLInputElement).value;
	  
		if (isChecked) checkArray.push(new FormControl(value));
		else checkArray.controls.forEach(
			(item, i) => (item.value === value) && checkArray.removeAt(i));
		
	}

	onSubmit(): void {
		
		this.recipesService.updateRecipe(this.recipeFormToFormData()).subscribe(result => {
			if(result.message.includes('Updated recipe')) this.router.navigate(['recipes',this.recipe.id]);
		});
	}

	onImagePicked(event: Event): void {

		if(!event || !event.target ) return;
		const target = event.target as HTMLInputElement;
		if(!target.files ) return;
		
		const file = target.files[0];
		this.recipeForm.patchValue({ image: file });
		this.recipeForm.get('image')?.updateValueAndValidity();
		const reader = new FileReader();
		reader.onload = () => this.imagePreview = reader.result as string;
		reader.readAsDataURL(file);
	}

	recipeFormToFormData(): FormData {
		
		const values = this.recipeForm.value;
		const recipeData = new FormData();

		const duration: Duration = {
			duration: values.duration.durationValue,
			unit: values.duration.durationUnit
		};

		recipeData.append('name', values.name as string);
		recipeData.append('description', JSON.stringify(values.description as string[]));
		recipeData.append('id',this.recipe.id as string);
		recipeData.append('ingredients',JSON.stringify(values.ingredients));
		recipeData.append('userId', values.userId);
		recipeData.append('categories', JSON.stringify(values.categories as Category[]));
		recipeData.append('duration',JSON.stringify(duration));
		recipeData.append('image',values.image);

    	return recipeData;
	}

}


