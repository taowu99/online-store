import { AuthService } from './../auth/auth.service';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private recipseService: RecipeService, private authService: AuthService) { }

    storeRecipes() {
        const recipes = this.recipseService.getRecipes();
        this.http
            .put("https://ng-course-recipe-book-a044c.firebaseio.com/recipes.json", recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>("https://ng-course-recipe-book-a044c.firebaseio.com/recipes.json")
            .pipe(
                map( recipes => {
                    return recipes.map(recipe => {
                        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients: []};
                    });
                }),
                tap(recipes => {
                    this.recipseService.setRecipes(recipes);
                })
            );
    }
}