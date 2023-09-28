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

### type/index.ts

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

### types/index.ts

```ts
export type Book = {
  id: number;
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
```

### types/index.ts

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
```

### types/index.ts

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

-- optional branch --

```bash
git checkout origin/build-one
```

## Step 7 - fill in reducer functionality:

### store.ts

```ts
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
```

— build —

```bash
npm run build
```

-- optional branch --

```bash
git checkout origin/build-two
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
store.subscribe(() => {
  const state = store.getState();
  console.log("> State changed:", state);
  renderSupplierStoreList(state.bookList);
  // add these two lines
  renderCustomerBasket(state.booksInBasket);
  renderCustomerDashboard(state.booksInBasket);
});
```

— build —

```bash
npm run build
```

-- optional branch --

```bash
git checkout origin/build-three
```

## Step 9 - add remove book action and reducer:

### store.ts

```ts
export const addBookToSupplierListAction = ({
  id,
  title,
  author,
  quantity,
}: Book): Action => ({
  type: "supplierList/addBook",
  payload: { id, title, author, quantity },
});

export const removeBookFromBasketAction = ({
  id,
  title,
  author,
  quantity,
}: Book): Action => ({
  type: "basket/removeBook",
  payload: { id, title, author, quantity },
});
```

```ts
 case "supplierList/addBook": {
      if (action.payload.id) {
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
        };
      }
      console.error("Need author and title to identify book");
      return prevState;
    }

    case "basket/removeBook": {
      if (action.payload.id) {
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

        return {
          ...prevState,
          booksInBasket: updatedBooksInBasket,
        };
      }
      console.error("Need title and author to manipulate state");
      return prevState;
    }
```

### helpers.ts

uncomment lines 58 - 74

```bash
npm run build
```

-- optional branch --

```bash
git checkout origin/main
```
