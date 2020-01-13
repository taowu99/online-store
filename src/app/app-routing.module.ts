import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeHomeComponent } from './recipes/recipe-home/recipe-home.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipesComponent } from './recipes/recipes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

const routes : Routes =[
    {path:'', redirectTo: 'recipes', pathMatch:'full'},
    {path:'recipes', component: RecipesComponent, children:[
        {path: '', component: RecipeHomeComponent},
        {path: 'new', component: RecipeEditComponent},
        {path: ':id', component: RecipeDetailComponent},
        {path: ':id/edit', component: RecipeEditComponent},
    ]},
    {path:'shopping-list', component: ShoppingListComponent},
    {path:'auth', component: AuthComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}