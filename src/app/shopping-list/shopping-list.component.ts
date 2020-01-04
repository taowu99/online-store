import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { Ingredient } from './../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients : Ingredient[];
  private changeSubscription : Subscription;
  
  constructor(private shoppingListService : ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.changeSubscription = this.shoppingListService.ingredientsChanged.subscribe((ingredients : Ingredient[]) => this.ingredients = ingredients);
  }

  ngOnDestroy() {
    this.changeSubscription.unsubscribe();
  }

  loadIngredient(idx: number) {
    this.shoppingListService.startedEditing.next(idx);
  }

}
