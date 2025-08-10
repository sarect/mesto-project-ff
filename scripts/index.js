// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
const addCardButton = document.querySelector('.profile__add-button');
const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardForm = newCardPopup.querySelector('.popup__form');
const inputCardName = newCardForm.querySelector('.popup__input_type_card-name');
const inputCardLink = newCardForm.querySelector('.popup__input_type_url');
const allPopups = document.querySelectorAll('.popup');

// @todo: Функция удаления карточки
function handleDeleteCard(evt) {
  evt.target.closest('.card').remove();
}

// @todo: Функция создания карточки
function createCard(cardData, handleDelete) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', handleDelete);

  return cardElement;
}

// @todo: Функции открытия и закрытия попапов
function openPopup(popupElement) {
  popupElement.classList.add('popup_is-opened');
}

function closePopup(popupElement) {
  popupElement.classList.remove('popup_is-opened');
}

function setPopupEventListeners() {
  allPopups.forEach((popup) => {
    const closeButton = popup.querySelector('.popup__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => closePopup(popup));
    }
  });
}

// @todo: Обработка формы добавления новой карточки
newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCardData = {
    name: inputCardName.value,
    link: inputCardLink.value,
  };

  const newCard = createCard(newCardData, handleDeleteCard);
  placesList.prepend(newCard);

  newCardForm.reset();
  closePopup(newCardPopup);
});

// @todo: Открытие попапа
addCardButton.addEventListener('click', () => {
  openPopup(newCardPopup);
});

// @todo: Вывести карточки на страницу
for (let i = 0; i < initialCards.length; i++) {
  const card = createCard(initialCards[i], handleDeleteCard);
  placesList.append(card);
}

setPopupEventListeners();
