import { createStore, getInitialState, reducer } from "./store.js";
import {
  renderCustomerBasket,
  renderCustomerDashboard,
  renderSupplierStoreList,
} from "./components.js";

export const store = createStore(reducer, getInitialState());

renderSupplierStoreList(store.getState().bookList);

store.subscribe(() => {
  const state = store.getState();
  console.log("> State changed:", state);
  renderSupplierStoreList(state.bookList);
  renderCustomerBasket(state.booksInBasket);
  renderCustomerDashboard(state.booksInBasket);
});
