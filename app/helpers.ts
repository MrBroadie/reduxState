import { store } from "./index.js";
import { addBookToBasketAction, removeBookFromBasketAction } from "./store.js";
import { Book } from "./types/types.js";

export const updateSupplierStoreList = (bookList: Book[]) => {
  const supplierStoreListElement = document.getElementById("supplierStore");

  if (!supplierStoreListElement) {
    console.error("Supplier store element not found");
    return;
  }

  supplierStoreListElement.innerHTML = "";

  bookList.forEach((book, index) => {
    const bookItemElement = document.createElement("li");
    const bookDetailsDiv = document.createElement("div");
    bookDetailsDiv.textContent = `${book.title} by ${book.author} - ${book.quantity} in stock`;
    bookItemElementClass(bookItemElement);
    const basketButton = document.createElement("button");
    basketButton.textContent = "Add to basket";
    addToBasketButton(basketButton);
    basketButton.addEventListener("click", () => {
      store.dispatch(addBookToBasketAction(book.title, book.author, 1));
    });

    bookItemElement.appendChild(bookDetailsDiv);
    bookItemElement.appendChild(basketButton);
    supplierStoreListElement.appendChild(bookItemElement);
  });
};

export const updateBooksInBasket = (booksInBasket: Book[]) => {
  const booksInBasketListElement = document.getElementById("customerBasket");

  if (!booksInBasketListElement) {
    console.error("Supplier store element not found");
    return;
  }

  booksInBasketListElement.innerHTML = "";
  booksInBasket.forEach((book) => {
    const bookItemElement = document.createElement("li");
    const bookDetailsDiv = document.createElement("div");
    bookDetailsDiv.textContent = `${book.title} by ${book.author} - ${book.quantity} in basket`;

    bookItemElementClass(bookItemElement);
    const basketButton = document.createElement("button");
    basketButton.textContent = "Remove from basket";
    removeFromBasketButton(basketButton);
    basketButton.addEventListener("click", () => {
      store.dispatch(removeBookFromBasketAction(book.title, book.author, 1));
    });

    bookItemElement.appendChild(bookDetailsDiv);
    bookItemElement.appendChild(basketButton);
    booksInBasketListElement.appendChild(bookItemElement);
  });
};

export const updateDashboard = (booksInBasket: Book[]) => {
  const booksOnDashboard = document.getElementById("customerDashboard");

  if (!booksOnDashboard) {
    console.error("Basket element not found");
    return;
  }

  booksOnDashboard.innerHTML = "";
  booksInBasket.forEach((book) => {
    const bookItemElement = document.createElement("li");
    bookItemElementClass(bookItemElement);
    const bookDetailsDiv = document.createElement("div");
    bookDetailsDiv.textContent = `${book.title} by ${book.author} - ${book.quantity} in basket`;
    const basketButton = document.createElement("button");
    basketButton.textContent = "Remove from basket";
    removeFromBasketButton(basketButton);

    basketButton.addEventListener("click", () => {
      store.dispatch(removeBookFromBasketAction(book.title, book.author, 1));
    });

    bookItemElement.appendChild(bookDetailsDiv);
    bookItemElement.appendChild(basketButton);
    booksOnDashboard.appendChild(bookItemElement);
  });
};

const bookItemElementClass = (element: HTMLElement) => {
  element.classList.add(
    "text-gray-800",
    "p-4",
    "m-2",
    "border-b",
    "border-gray-200",
    `bg-blue-100`,
    "flex",
    "flex-col",
    "justify-between",
    "items-center",
    "space-x-4"
  );
};

const addToBasketButton = (element: HTMLElement) => {
  element.classList.add("bg-blue-500", "text-white", "p-4", "mt-2", "rounded");
};

const removeFromBasketButton = (element: HTMLElement) => {
  element.classList.add("bg-red-500", "text-white", "p-4", "m-2", "rounded");
};
