import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeResolver } from './recipes/recipe-resolver.service';
import { RecipesComponent } from './recipes/recipes.component';

const routes: Routes = [
	{ path: '', redirectTo: '/recipes', pathMatch: 'full' },
	{ path: 'recipes', component: RecipesComponent },
	{ path: 'recipes/:id/edit', component: RecipeEditComponent, resolve: { recipe: RecipeResolver } },
	{ path: 'recipes/:id', component: RecipeDetailComponent, resolve: { recipe: RecipeResolver } },
	{ path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
