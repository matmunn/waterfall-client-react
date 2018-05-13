import { createSelector } from 'reselect'
import { find, filter } from 'lodash'

export const categoriesSelector = state => state.categories.categories

export const displayCategoriesSelector = createSelector(
  categoriesSelector,
  categories => filter(categories, cat => cat.display_in_list)
)

export const categorySelector = categoryId => {
  return createSelector(
    categoriesSelector,
    categories => find(categories, category => category.id === categoryId)
  )
}
