
import './index.css';
import { openModal, closeModal, setModalCloseHandlers } from './components/modal.js';
import { createCard, handleLike, handleDelete } from './components/card.js';
import { initialCards } from './components/initialCards.js';

const cardsContainer = document.querySelector('.places__list');
const addCardButton = document.querySelector('.profile__add-button');
const editButton = document.querySelector('.profile__edit-button');

const editPopup = document.querySelector('.popup_type_edit');
const editForm = editPopup.querySelector('.popup__form');
const nameInput = editForm.querySelector('.popup__input_type_name');
const descInput = editForm.querySelector('.popup__input_type_description');

const profileTitle = document.querySelector('.profile__title');
const profileDesc = document.querySelector('.profile__description');

const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardForm = newCardPopup.querySelector('.popup__form');
const inputCardName = newCardForm.querySelector('.popup__input_type_card-name');
const inputCardLink = newCardForm.querySelector('.popup__input_type_url');

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

function handlePreview(name, link) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imagePopup);
}

editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  descInput.value = profileDesc.textContent;
  openModal(editPopup);
});

addCardButton.addEventListener('click', () => openModal(newCardPopup));

editForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value.trim();
  profileDesc.textContent = descInput.value.trim();
  closeModal(editPopup);
});

newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const card = createCard({ name: inputCardName.value.trim(), link: inputCardLink.value.trim() }, handleLike, handleDelete, handlePreview);
  cardsContainer.prepend(card);
  newCardForm.reset();
  closeModal(newCardPopup);
});

initialCards.forEach((item) => {
  const card = createCard(item, handleLike, handleDelete, handlePreview);
  cardsContainer.append(card);
});

setModalCloseHandlers();
