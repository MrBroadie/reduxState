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
  const findBook = (arr: Book[]) =>
    arr.find((book) => book.id === action.payload.id);

  switch (action.type) {
    case "supplierList/removeBook": {
      if (action.payload.id) {
        const bookInList = findBook(prevState.bookList);
        if (bookInList && bookInList.quantity > 0) {
          const updatedBookList = prevState.bookList.map((book) => {
            if (book.id === action.payload.id) {
              return {
                ...book,
                quantity: book.quantity - 1,
              };
            }
            return book;
          });

          return {
            ...prevState,
            bookList: updatedBookList,
          };
        } else {
          console.error("Book list has quantity of 0");
          return prevState;
        }
      } else {
        console.error("Need title and author to manipulate state");
        return prevState;
      }
    }

    case "basket/addBook": {
      if (action.payload.id) {
        const bookInList = findBook(prevState.bookList);
        const bookInBasket = findBook(prevState.booksInBasket);
        if (bookInList && bookInList.quantity > 0) {
          let updatedBooksInBasket = [...prevState.booksInBasket];
          if (!bookInBasket && bookInList) {
            updatedBooksInBasket.push({ ...bookInList, quantity: 1 });
          } else {
            updatedBooksInBasket = updatedBooksInBasket.map((book) => {
              if (book.id === action.payload.id) {
                return {
                  ...book,
                  quantity: book.quantity + 1,
                };
              }
              return book;
            });
          }

          return {
            ...prevState,
            booksInBasket: updatedBooksInBasket,
          };
        }
      } else {
        console.error("Need title and author to manipulate state");
        return prevState;
      }
    }

    default:
      return prevState;
  }
};
