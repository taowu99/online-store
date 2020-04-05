import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private recipseService: RecipeService) { }

    storeRecipes() {
        const recipes = this.recipseService.getRecipes();
        this.http
            .put("https://ng-course-recipe-book-a044c.firebaseio.com/recipes.json", recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>("https://ng-course-recipe-book-a044c.firebaseio.com/recipes.json")
            .pipe(map( recipes => {
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients: []};
                });
            }),
            tap(recipes => {
                this.recipseService.setRecipes(recipes);
            })
            )
    }
}