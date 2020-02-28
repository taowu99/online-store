import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';

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
        this.http
            .get<Recipe[]>("https://ng-course-recipe-book-a044c.firebaseio.com/recipes.json")
            .subscribe(recipes => {
                console.log(recipes);
            })
    }
}