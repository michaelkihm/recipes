import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { ALL_CATEGORIES } from 'models/category.type';
import { ALL_INGREDIENT_UNITS } from 'models/ingredient.model';
import { ALL_DURATION_UNITS, Recipe } from 'models/recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

	recipe: Recipe;
	recipeForm: FormGroup;
	durationUnits = ALL_DURATION_UNITS;
	ingredientUnits = ALL_INGREDIENT_UNITS;
	allowedCategories = ALL_CATEGORIES;

	constructor(private route: ActivatedRoute) { }

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
			'categories': new FormArray(this.recipe.category.map(cat => new FormControl(cat)))
		});
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
		console.log(this.recipeForm);
	}

}
