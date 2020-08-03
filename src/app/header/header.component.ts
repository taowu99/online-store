import * as RecipesActions  from './../recipes/store/recipe.actions';
import * as AuthActions from './../auth/store/auth.action';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
    private userSub: Subscription;
    isAuthenticated = false;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.userSub = this.store
            .select('auth')
            .pipe(map(authState => authState.user))
            .subscribe(user => {
                this.isAuthenticated = !!user;
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    onLogout() {
        // this.authService.logout();
        this.store.dispatch(new AuthActions.Logout());
    }

    onSaveData() {
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipesActions.StoreRecipes());
    }

    onFetchData() {
        // this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }
}