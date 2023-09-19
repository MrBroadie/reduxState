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

export const addBookToBasketAction = (
  title: string,
  author: string,
  quantity: number
): Action => ({
  type: "book/addBookToBasket",
  payload: { title, author, quantity },
});

export const removeBookFromBasketAction = (
  title: string,
  author: string,
  quantity: number
): Action => ({
  type: "book/removeBookFromBasket",
  payload: { title, author, quantity },
});

export const reducer: Reducer = (prevState, action) => {
  switch (action.type) {
    case "book/addBookToBasket": {
      if (action.payload.author && action.payload.title) {
        const findBook = (arr: Book[]) =>
          arr.find(
            (book) =>
              book.author === action.payload.author &&
              book.title === action.payload.title
          );

        const bookInList = findBook(prevState.bookList);
        if (bookInList && bookInList.quantity > 0) {
          const updatedBookList = prevState.bookList.map((book) => {
            if (
              book.author === action.payload.author &&
              book.title === action.payload.title
            ) {
              return {
                ...book,
                quantity: book.quantity - 1,
              };
            }
            return book;
          });

          const bookInBasket = findBook(prevState.booksInBasket);
          let updatedBooksInBasket = [...prevState.booksInBasket];

          if (!bookInBasket) {
            updatedBooksInBasket.push({ ...bookInList, quantity: 1 });
          } else {
            updatedBooksInBasket = updatedBooksInBasket.map((book) => {
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
      const existingBookIndex = prevState.bookList.findIndex(
        (book) =>
          book.title === action.payload.title &&
          book.author === action.payload.author
      );

      const existingBasketBookIndex = prevState.booksInBasket.findIndex(
        (book) =>
          book.title === action.payload.title &&
          book.author === action.payload.author
      );

      if (existingBookIndex !== -1 && existingBasketBookIndex !== -1) {
        const existingBook = prevState.bookList[existingBookIndex];
        const existingBasketBook =
          prevState.booksInBasket[existingBasketBookIndex];

        // Increase the quantity in the bookList
        const updatedBook = {
          ...existingBook,
          quantity: existingBook.quantity + action.payload.quantity,
        };

        // Decrease the quantity in the booksInBasket, or remove it if quantity is zero
        const updatedBooksInBasket = [...prevState.booksInBasket];
        if (existingBasketBook.quantity <= action.payload.quantity) {
          updatedBooksInBasket.splice(existingBasketBookIndex, 1);
        } else {
          updatedBooksInBasket[existingBasketBookIndex].quantity -=
            action.payload.quantity;
        }

        // Update the bookList
        const updatedBookList = [...prevState.bookList];
        updatedBookList[existingBookIndex] = updatedBook;

        return {
          ...prevState,
          bookList: updatedBookList,
          booksInBasket: updatedBooksInBasket,
        };
      } else {
        console.error("Book not found in basket or book list");
        return prevState;
      }
    }
    default:
      return prevState;
  }
};
