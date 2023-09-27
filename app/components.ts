import { renderHTMLElement } from "./helpers.js";
import { Book } from "./types/index.js";

export const renderSupplierStoreList = (bookList: Book[]) =>
  renderHTMLElement(bookList, "supplierStore", "add", "book/addBookToBasket");
