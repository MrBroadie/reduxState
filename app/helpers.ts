import { store } from "./index.js";
import { addBookToBasketAction, removeBookFromBasketAction } from "./store.js";
import { Book } from "./types/types.js";

export const renderHTMLElement = (
  bookArray: Book[],
  id: string,
  button: string,
  actionType: string
) => {
  const supplierStoreListElement = document.getElementById(id);

  if (!supplierStoreListElement) {
    console.error("Supplier store element not found");
    return;
  }

  supplierStoreListElement.innerHTML = "";

  bookArray.forEach((book) => {
    const bookItemElement = document.createElement("li");
    const bookDetailsDiv = document.createElement("div");
    bookDetailsDiv.textContent = `${book.title} by ${book.author} - ${book.quantity} in stock`;
    bookItemElementClass(bookItemElement);
    const basketButton = document.createElement("button");

    if (button === "add") {
      addToBasketButton(basketButton);
      basketButton.textContent = "Add to basket";
    } else {
      removeFromBasketButton(basketButton);
      basketButton.textContent = "Remove from basket";
    }

    basketButton.addEventListener("click", () => {
      actionType === "book/addBookToBasket"
        ? store.dispatch(
            addBookToBasketAction({
              id: book.id,
              title: book.title,
              author: book.author,
              quantity: 1,
            })
          )
        : store.dispatch(
            removeBookFromBasketAction({
              id: book.id,
              title: book.title,
              author: book.author,
              quantity: 1,
            })
          );
    });

    bookItemElement.appendChild(bookDetailsDiv);
    bookItemElement.appendChild(basketButton);
    supplierStoreListElement.appendChild(bookItemElement);
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
