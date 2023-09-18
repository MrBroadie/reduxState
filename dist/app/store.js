import { books } from "./api.js";
export const createStore = (reducer, initialState) => {
    const store = {
        state: initialState,
        listeners: [],
        dispatch: () => { },
        subscribe: () => { },
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
export const addBookToBasketAction = (title, author, quantity) => ({
    type: "book/addBookToBasket",
    payload: { title, author, quantity },
});
export const removeBookFromBasketAction = (title, author, quantity) => ({
    type: "book/removeBookFromBasket",
    payload: { title, author, quantity },
});
export const reducer = (prevState, action) => {
    switch (action.type) {
        case "book/addBookToBasket": {
            const existingBookIndex = prevState.bookList.findIndex((book) => book.title === action.payload.title &&
                book.author === action.payload.author);
            if (existingBookIndex !== -1) {
                const existingBook = prevState.bookList[existingBookIndex];
                if (existingBook.quantity < action.payload.quantity) {
                    console.error("Not enough books available");
                    return prevState;
                }
                const updatedBook = Object.assign(Object.assign({}, existingBook), { quantity: existingBook.quantity - action.payload.quantity });
                const updatedBookList = [...prevState.bookList];
                updatedBookList[existingBookIndex] = updatedBook;
                const existingBasketBookIndex = prevState.booksInBasket.findIndex((book) => book.title === action.payload.title &&
                    book.author === action.payload.author);
                let updatedBooksInBasket;
                if (existingBasketBookIndex !== -1) {
                    // Book already in the basket, update its quantity
                    updatedBooksInBasket = [...prevState.booksInBasket];
                    updatedBooksInBasket[existingBasketBookIndex].quantity +=
                        action.payload.quantity;
                }
                else {
                    // Book not in the basket, add it to the basket
                    updatedBooksInBasket = [
                        ...prevState.booksInBasket,
                        Object.assign(Object.assign({}, action.payload), { quantity: 1 }),
                    ];
                }
                return Object.assign(Object.assign({}, prevState), { bookList: updatedBookList, booksInBasket: updatedBooksInBasket });
            }
            else {
                console.error("Book not found");
                return prevState;
            }
        }
        case "book/removeBookFromBasket": {
            const existingBookIndex = prevState.bookList.findIndex((book) => book.title === action.payload.title &&
                book.author === action.payload.author);
            const existingBasketBookIndex = prevState.booksInBasket.findIndex((book) => book.title === action.payload.title &&
                book.author === action.payload.author);
            if (existingBookIndex !== -1 && existingBasketBookIndex !== -1) {
                const existingBook = prevState.bookList[existingBookIndex];
                const existingBasketBook = prevState.booksInBasket[existingBasketBookIndex];
                // Increase the quantity in the bookList
                const updatedBook = Object.assign(Object.assign({}, existingBook), { quantity: existingBook.quantity + action.payload.quantity });
                // Decrease the quantity in the booksInBasket, or remove it if quantity is zero
                const updatedBooksInBasket = [...prevState.booksInBasket];
                if (existingBasketBook.quantity <= action.payload.quantity) {
                    updatedBooksInBasket.splice(existingBasketBookIndex, 1);
                }
                else {
                    updatedBooksInBasket[existingBasketBookIndex].quantity -=
                        action.payload.quantity;
                }
                // Update the bookList
                const updatedBookList = [...prevState.bookList];
                updatedBookList[existingBookIndex] = updatedBook;
                return Object.assign(Object.assign({}, prevState), { bookList: updatedBookList, booksInBasket: updatedBooksInBasket });
            }
            else {
                console.error("Book not found in basket or book list");
                return prevState;
            }
        }
        default:
            return prevState;
    }
};
