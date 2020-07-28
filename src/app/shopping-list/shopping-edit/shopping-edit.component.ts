import { Ingredient } from './../../shared/ingredient.model';
import { Subscription, from } from 'rxjs';
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.action';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') editForm : NgForm; 
  ingredientIndex : number;
  subscription : Subscription;
  editedItem : Ingredient;

  constructor(
    private shoppingListService : ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit() {
    this.ingredientIndex = -1;
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.ingredientIndex = stateData.editedIngredientIndex;
        this.editedItem = stateData.editedIngredient;
        this.editForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }else {
        this.ingredientIndex = -1;
      }
    });
    // this.subscription = this.shoppingListService.startedEditing.subscribe((idx : number) => {
    //   this.ingredientIndex = idx;
    //   // this.editedItem = this.shoppingListService.getIngredientByIndex(idx);
    //   this.editedItem = this.store.select('shoppingList')[idx];
    //   console.log(this.store.select('shoppingList'));
    //   this.editForm.setValue({
    //     name: this.editedItem.name,
    //     amount: this.editedItem.amount
    //   })
    // } );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  deleteItem(form : NgForm) {
    if (this.ingredientIndex >= 0) {
      // this.shoppingListService.deleteIngredient(this.ingredientIndex);
      this.store.dispatch(new ShoppingListActions.DeleteIngredient())
      this.resetForm(form);
    }
  }

  resetForm(form : NgForm) {
    form.reset();
    this.ingredientIndex = -1;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmitItem(form : NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.ingredientIndex >= 0) {
      //this.shoppingListService.updateIngredient(this.ingredientIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient({ingredient: newIngredient}))
    }
    else {
      // this.shoppingListService.addIngredient(new Ingredient(value.name, value.amount));
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.resetForm(form);
  }
}
