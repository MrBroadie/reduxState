import { books } from "./api.js";
import { StoreState, Store, Action, Reducer, Book } from "./types/index.js";

export const createStore = (reducer: Reducer, initialState: StoreState) => {
  const store: Store = {
    state: initialState,
    listeners: [],
    dispatch: () => {},
    subscribe: () => {},
    getState: () => store.state,
  };

  store.subscribe = (listener) => {
    store.listeners.push(listener);
  };

  store.dispatch = (action) => {
    console.log("> Action", action);
    store.state = reducer(store.state, action);
    store.listeners.forEach((listener) => listener());
  };

  return store;
};
export const getInitialState = () => ({
  // This would be a redux thunk action that calls our API
  bookList: books,
  booksInBasket: [],
});

export const addBookToBasketAction = ({
  id,
  title,
  author,
  quantity,
}: Book): Action => ({
  type: "basket/addBook",
  payload: { id, title, author, quantity },
});

export const removeBookFromSupplierListAction = ({
  id,
  title,
  author,
  quantity,
}: Book): Action => ({
  type: "supplierList/removeBook",
  payload: { id, title, author, quantity },
});

export const reducer: Reducer = (prevState, action) => {
  switch (action.type) {
    case "basket/addBook": {
      return prevState;
    }
    case "supplierList/removeBook": {
      return prevState;
    }
    default: {
      return prevState;
    }
  }
};
