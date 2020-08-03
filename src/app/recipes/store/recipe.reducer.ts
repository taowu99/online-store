import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import { StartEdit } from 'src/app/shopping-list/store/shopping-list.action';

export interface State {
    recipes: Recipe[];
}

const initialState: State  = {
    recipes: []
}

export function recipeReducer(state = initialState, action: RecipeActions.RecipesActions) {
    switch (action.type) {
        case RecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipeActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }
        case RecipeActions.UPDATE_RECIPE:
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            };

            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe;
            return {
                ...state,
                recipes: updatedRecipes 
            }
        case RecipeActions.DELETE_RECIPE:
            return {
                ...StartEdit,
                recipes: state.recipes.filter((recipe, index) =>{
                    return index !== action.payload
                })
            }
        default:
            return state;
    }
}