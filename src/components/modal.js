const handleKeyEscape = (event) => {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) closeModal(openedPopup);
  }
};

export const createEventListeners = (popup) => {
  popup.querySelector(".popup__close").addEventListener("click", () => {
    closeModal(popup);
  });

  popup.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains("popup")) {
      closeModal(popup);
    }
  });
};

export const openModal = (popup) => {
  popup.classList.add("popup_is-opened");

  document.addEventListener("keydown", handleKeyEscape);
};

export const closeModal = (popup) => {
  popup.classList.remove("popup_is-opened");

  document.removeEventListener("keydown", handleKeyEscape);
};
