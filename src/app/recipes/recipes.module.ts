import { SharedModule } from './../shared/shared.module';
import { ShoppingListModule } from './../shopping-list/shopping-list.module';
import { RecipesRoutingModule } from './recipes-routing.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeHomeComponent } from './recipe-home/recipe-home.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipesComponent } from './recipes.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [        
        RecipeDetailComponent,
        RecipeListComponent,
        RecipeItemComponent,
        RecipeHomeComponent,
        RecipeEditComponent,
        RecipesComponent
    ],
    imports:[RouterModule, SharedModule, ReactiveFormsModule, RecipesRoutingModule]
})
export class RecipesModule {}