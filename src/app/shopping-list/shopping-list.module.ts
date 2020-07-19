import { SharedModule } from './../shared/shared.module';
import { ShoppingListComponent } from './shopping-list.component';
import { NgModule } from '@angular/core';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports:[
        RouterModule.forChild([{path:'shopping-list', component: ShoppingListComponent}]),
        SharedModule, FormsModule]
})
export class ShoppingListModule {}