import { createSelector } from 'reselect'

export const categoriesSelector = state => state.categories.categories

export const displayCategoriesSelector = createSelector(
  categoriesSelector,
  categories => categories.filter(cat => cat.display_in_list)
)
