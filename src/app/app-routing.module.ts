import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes : Routes =[
    {path:'', redirectTo: 'recipes', pathMatch:'full'},
    {path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)},
    {path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'}
];
@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {

}