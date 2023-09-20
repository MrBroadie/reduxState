# Introduction to State Management Using Redux

In this guide, we will walk through the steps to set up a global state management library.

## Before you start

```bash
npm i
npm run build:css
```

## Step 1 - Function to create store:

### store.ts

```ts
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
```

### type.ts

```ts
export type Store = {
  state: StoreState;
  listeners: (() => void)[];
  getState: () => StoreState;
  subscribe: (listener: () => void) => void;
  dispatch: (action: Action) => void;
};
```

## Step 2 - Create the initial state:

### store.ts

```ts
export const getInitialState = () => ({
  // This would be a redux thunk action that calls our API
  bookList: books,
  booksInBasket: [],
});
```

### types.ts

```ts
export type Book = {
  title: string;
  author: string;
  quantity: number;
};

export type StoreState = {
  bookList: Book[];
  booksInBasket: Book[];
};
```

## Step 3 - Create action:

### store.ts

```ts
export const addBookToBasketAction = (
  title: string,
  author: string,
  quantity: number
): Action => ({
  type: "book/addBookToBasket",
  payload: { title, author, quantity },
});
```

### types.ts

```ts
export type Action = {
  type: string;
  payload: Book;
};
```

## Step 4 - Create reducer:

### store.ts

```ts
export const reducer: Reducer = (prevState, action) => {
  switch (action.type) {
    case "book/addBookToBasket": {
      return prevState;
    }
    default: {
      return prevState;
    }
  }
};
```

### types.ts

```ts
export type Reducer = (state: StoreState, action: Action) => StoreState;
```

## Step 5 - Create the store:

### index.ts

```ts
export const store = createStore(reducer, getInitialState());
```

## Step 6 - render initial state and add to subscriber:

### components.ts

```ts
export const renderSupplierStoreList = (bookList: Book[]) =>
  renderHTMLElement(bookList, "supplierStore", "add", "book/addBookToBasket");
```

### index.ts

```ts
renderSupplierStoreList(store.getState().bookList);

store.subscribe(() => {
  const state = store.getState();
  console.log("> State changed:", state);
  renderSupplierStoreList(state.bookList);
});
```

— Build and run application —

```bash
npm run build
npm run start
```

## Step 7 - fill in reducer functionality:

### store.ts

```ts
const findBook = (arr: Book[]) =>
  arr.find(
    (book) =>
      book.author === action.payload.author &&
      book.title === action.payload.title
  );
switch (action.type) {
  case "book/addBookToBasket": {
    if (action.payload.author && action.payload.title) {
      // updates supplier list
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

        // updates customer basket
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
}
```

— build —

```bash
npm run build
```

## Step 8 - Add components to listen to booksInBasket:

### components.ts

```ts
export const renderCustomerBasket = (booksInBasket: Book[]) =>
  renderHTMLElement(
    booksInBasket,
    "customerBasket",
    "remove",
    "book/removeBookFromBasket"
  );

export const renderCustomerDashboard = (booksInBasket: Book[]) =>
  renderHTMLElement(
    booksInBasket,
    "customerDashboard",
    "remove",
    "book/removeBookFromBasket"
  );
```

### index.ts

```ts
renderCustomerBasket(state.booksInBasket);
renderCustomerDashboard(state.booksInBasket);
```

— build —

## Step 9 - add remove book reducer:

### store.ts

```ts
case "book/removeBookFromBasket": {
if (action.payload.author && action.payload.title) {
// updates customer basket
const bookInBasket = findBook(prevState.booksInBasket);

        if (!bookInBasket) {
          console.error("Book not found in basket");
          return prevState;
        }

        let updatedBooksInBasket = [...prevState.booksInBasket];
        if (bookInBasket.quantity === 1) {
          updatedBooksInBasket = updatedBooksInBasket.filter(
            (book) =>
              book.author !== action.payload.author ||
              book.title !== action.payload.title
          );
        } else {
          updatedBooksInBasket = updatedBooksInBasket.map((book) => {
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
```

— build —
