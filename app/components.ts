import { renderHTMLElement } from "./helpers.js";
import { Book } from "./types/index.js";

export const renderSupplierStoreList = (bookList: Book[]) =>
  renderHTMLElement(bookList, "supplierStore", "add", "book/addBookToBasket");

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
