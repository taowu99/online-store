import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  private recipesSubscription : Subscription;

  constructor(
    private recipeService : RecipeService, 
    private router: Router, 
    private route : ActivatedRoute) { 
  }

  ngOnInit() { 
    this.recipes = this.recipeService.getRecipes();
    this.recipesSubscription = this.recipeService.recipesChanged
      .subscribe( 
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
  }

  ngOnDestroy() {
    this.recipesSubscription.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
