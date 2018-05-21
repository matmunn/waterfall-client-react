import axios from 'axios'
import { filter, findIndex } from 'lodash'

import config from 'Config'

import { SET_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY,
         DELETE_CATEGORY } from '../mutations'

const mutations = {
  [SET_CATEGORIES]: (state, categories) => {
    return {
      ...state,
      categories,
    }
  },
  [ADD_CATEGORY]: (state, category) => {
    return {
      ...state,
      categories: [
        ...state.categories,
        category
      ]
    }
  },
  [UPDATE_CATEGORY]: (state, category) => {
    const elmIndex = findIndex(state.categories, x => x.id === category.id)

    let data = Array.from(state.categories)
    data.splice(elmIndex, 1, category)

    return {
      ...state,
      categories: data,
    }
  },
  [DELETE_CATEGORY]: (state, categoryId) => {
    return {
      ...state,
      categories: filter(state.categories, x => x.id !== categoryId)
    }
  },
}

const initialState = {
  categories: []
}

export const actionSetCategories = categories => ({
  type: SET_CATEGORIES,
  payload: categories
})

export const actionAddCategory = category => ({
  type: ADD_CATEGORY,
  payload: category
})

export const actionUpdateCategory = category => ({
  type: UPDATE_CATEGORY,
  payload: category
})

export const actionDeleteCategory = categoryId => ({
  type: DELETE_CATEGORY,
  payload: categoryId
})

const actions = {
  setCategories: actionSetCategories,
  addCategory: actionAddCategory,
  updateCategory: actionAddCategory,
  deleteCategory: actionDeleteCategory
}

export const dispatchGetAllCategories = dispatch => {
  return new Promise((resolve, reject) => {
    axios.get(`${config.baseApiUrl}/categories`).then(response => {
      if (response.status === 200) {
        dispatch(actions.setCategories(response.data))
        resolve(true)
      }
      reject(`There was an error`)
    }, error => {
      reject(error)
    })
  })
}

export const dispatchAddCategory = (dispatch, categoryData) => {
  return new Promise((resolve, reject) => {
    axios.post(`${config.baseApiUrl}/category`, categoryData).then(response => {
      if (response.status === 201) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchEditCategory = (dispatch, categoryData) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${config.baseApiUrl}/category/${categoryData.id}`, categoryData).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

export const dispatchDeleteCategory = (dispatch, categoryId) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${config.baseApiUrl}/category/${categoryId}`).then(response => {
      if (response.status === 200) {
        resolve(true)
      }
      reject(`There was an error`)
    }, () => {
      reject(`There was an error`)
    })
  })
}

const dispatchers = {
  dispatchGetAllCategories,
  dispatchAddCategory,
  dispatchEditCategory,
  dispatchDeleteCategory
}

const reducer = (state = initialState, action) => {
  return mutations[action.type] ? mutations[action.type](state, action.payload) : state
}


export {
  reducer as default,
  dispatchers
}
