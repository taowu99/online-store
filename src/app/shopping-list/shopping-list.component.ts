import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.action';
import * as fromApp from '../store/app.reducer';
import { Ingredient } from './../shared/ingredient.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients : Observable<{ingredients: Ingredient[]}>
  private changeSubscription : Subscription;
  
  constructor(
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.changeSubscription = this.shoppingListService.ingredientsChanged.subscribe((ingredients : Ingredient[]) => this.ingredients = ingredients);
  }

  ngOnDestroy() {
    // this.changeSubscription.unsubscribe();
  }

  loadIngredient(idx: number) {
    // this.shoppingListService.startedEditing.next(idx);
    this.store.dispatch(new ShoppingListActions.StartEdit(idx));
  }

}
