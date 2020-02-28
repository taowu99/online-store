import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>()

    private recipes: Recipe[] = [
        new Recipe("Recipe 1", 'This is test', 'https://ali.xinshipu.cn/20130210/original/1360433502308.jpg', [
            new Ingredient('Meat', 1), new Ingredient('French Fries', 20)
        ]),
        new Recipe("Recipe 2", 'This is test 2', 'https://ali.xinshipu.cn/20120314/original/1331690411237.jpg', [
            new Ingredient('Beef', 2), new Ingredient('water', 20)
        ]),
        new Recipe("Recipe 3", 'This is test 3', 'http://5b0988e595225.cdn.sohucs.com/images/20181006/5a77198527c342d591d76adddad1d153.jpeg', [
            new Ingredient('Pork', 3), new Ingredient('Potato', 20)
        ])];

    getRecipes() {
        return this.recipes.slice();
    }

    setRecipes(recipes : Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipe(idx : number) {
        return this.recipes[idx];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}