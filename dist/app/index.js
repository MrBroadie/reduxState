import { updateBooksInBasket, updateDashboard, updateSupplierStoreList, } from "./helpers.js";
import { createStore, getInitialState, reducer } from "./store.js";
export const store = createStore(reducer, getInitialState());
updateSupplierStoreList(store.getState().bookList);
store.subscribe(() => {
    const state = store.getState();
    console.log("> State changed:", state);
    updateSupplierStoreList(state.bookList);
    updateBooksInBasket(state.booksInBasket);
    updateDashboard(state.booksInBasket);
});
