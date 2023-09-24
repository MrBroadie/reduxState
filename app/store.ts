import { books } from "./api.js";
import { StoreState, Store, Action, Reducer, Book } from "./types/types.js";

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
  type: "book/addBookToBasket",
  payload: { id, title, author, quantity },
});

export const removeBookFromBasketAction = ({
  id,
  title,
  author,
  quantity,
}: Book): Action => ({
  type: "book/removeBookFromBasket",
  payload: { id, title, author, quantity },
});

export const reducer: Reducer = (prevState, action) => {
  const findBook = (arr: Book[]) =>
    arr.find((book) => book.id === action.payload.id);
  switch (action.type) {
    case "book/addBookToBasket": {
      if (action.payload.author && action.payload.title) {
        // updates supplier list
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

          // updates customer basket
          const bookInBasket = findBook(prevState.booksInBasket);
          let updatedBooksInBasket = [...prevState.booksInBasket];
          if (!bookInBasket) {
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
            bookList: updatedBookList,
            booksInBasket: updatedBooksInBasket,
          };
        }
        console.error("Book list has quantity of 0");
        return prevState;
      }
      console.error("Need title and author to manipulate state");
      return prevState;
    }

    case "book/removeBookFromBasket": {
      if (action.payload.id) {
        // updates customer basket
        const bookInBasket = findBook(prevState.booksInBasket);

        if (!bookInBasket) {
          console.error("Book not found in basket");
          return prevState;
        }

        let updatedBooksInBasket = [...prevState.booksInBasket];
        if (bookInBasket.quantity === 1) {
          updatedBooksInBasket = updatedBooksInBasket.filter(
            (book) => book.id !== action.payload.id
          );
        } else {
          updatedBooksInBasket = updatedBooksInBasket.map((book) => {
            if (book.id === action.payload.id) {
              return {
                ...book,
                quantity: book.quantity - 1,
              };
            }
            return book;
          });
        }

        // updates supplier list
        const updatedBookList = prevState.bookList.map((book) => {
          if (
            book.author === action.payload.author &&
            book.title === action.payload.title
          ) {
            return {
              ...book,
              quantity: book.quantity + 1,
            };
          }
          return book;
        });

        return {
          ...prevState,
          bookList: updatedBookList,
          booksInBasket: updatedBooksInBasket,
        };
      }
      console.error("Need author and title to identify book");
      return prevState;
    }

    default:
      return prevState;
  }
};
