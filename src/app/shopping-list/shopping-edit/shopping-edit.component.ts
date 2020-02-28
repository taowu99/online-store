import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgForm } from '@angular/forms';

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

  constructor(private shoppingListService : ShoppingListService) { }

  ngOnInit() {
    this.ingredientIndex = -1;
    this.subscription = this.shoppingListService.startedEditing.subscribe((idx : number) => {
      this.ingredientIndex = idx;
      this.editedItem = this.shoppingListService.getIngredientByIndex(idx);
      this.editForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    } );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteItem(form : NgForm) {
    if (this.ingredientIndex >= 0) {
      this.shoppingListService.deleteIngredient(this.ingredientIndex);
      this.resetForm(form);
    }
  }

  resetForm(form : NgForm) {
    form.reset();
    this.ingredientIndex = -1;
  }

  onSubmitItem(form : NgForm) {
    console.log(form);
    const value = form.value;
    if (this.ingredientIndex >= 0)
      this.shoppingListService.updateIngredient(this.ingredientIndex, new Ingredient(value.name, value.amount));
    else
      this.shoppingListService.addIngredient(new Ingredient(value.name, value.amount));
    this.resetForm(form);
  }
}
