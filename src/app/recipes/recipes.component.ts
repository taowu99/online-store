import { Recipe } from './recipe.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: []
})
export class RecipesComponent implements OnInit {
  selectedRecipe : Recipe;

  constructor() { }

  ngOnInit() {
  }

}
