import { Ingredient } from './../shared/ingredient.model';
import { OnInit, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService implements OnInit{
  ingredientsChanged = new Subject<Ingredient[]>();    
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [new Ingredient('Apple', 5), new Ingredient('Tomato', 10)];

  ngOnInit() { }

  getIngredients() {
      return this.ingredients.slice();
  }

  addIngredient(ingredient : Ingredient) {
      this.ingredients.push(ingredient);
      this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(idx : number) {
    this.ingredients.splice(idx, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients : Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(idx : number, newIngredient : Ingredient) {
    this.ingredients[idx] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  
  getIngredientByIndex(idx : number) : Ingredient {
    return this.ingredients[idx];
  }
}