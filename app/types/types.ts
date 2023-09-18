export type Book = {
  title: string;
  author: string;
  quantity: number;
};

export type StoreState = {
  bookList: Book[];
  booksInBasket: Book[];
};

export type Store = {
  state: StoreState;
  listeners: (() => void)[];
  getState: () => StoreState;
  subscribe: (listener: () => void) => void;
  dispatch: (action: Action) => void;
};

export type Action = {
  type: string;
  payload: Book;
};

export type Reducer = (state: StoreState, action: Action) => StoreState;
