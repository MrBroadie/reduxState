import { books } from "./api.js";
console.log(books);

const storeExample = {
  state: {},
  listeners: [],
  dispatch: () => {},
  subscribe: () => {},
  getState: () => {},
};

const createStore = (reducer, initialState) => {
  const store = {};
  store.state = initialState;
  store.listeners = [];

  store.getState = () => store.state;

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
const getInitialState = () => ({
  // This would be a redux thunk action that calls our API
  bookList: books,
});

const createAddBookAction = (title, author, quantity) => ({
  type: "book/addBook",
  payload: {
    title,
    author,
    quantity,
  },
});

const reducer = (prevState = getInitialState(), action) => {
  if (action.type === "book/addBook") {
    const existingBookIndex = prevState.bookList.findIndex(
      (book) =>
        book.title === action.payload.title &&
        book.author === action.payload.author
    );

    if (existingBookIndex !== -1) {
      const existingBook = prevState.bookList[existingBookIndex];

      if (existingBook.quantity < action.payload.quantity) {
        console.error("Not enough books available");
        return prevState;
      }

      const updatedBook = {
        ...existingBook,
        quantity: existingBook.quantity - action.payload.quantity,
      };

      const updatedBookList = [...prevState.bookList];
      updatedBookList[existingBookIndex] = updatedBook;

      return {
        ...prevState,
        bookList: updatedBookList,
      };
    } else {
      console.error("Book not found");
      return prevState;
    }
  }
  return prevState;
};

const store = createStore(reducer);

store.subscribe(() => {
  const state = store.getState();
  console.log("> State changed:", state);
});
