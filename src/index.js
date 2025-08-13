import './index.css';
import { openModal, closeModal, setModalCloseHandlers } from './components/modal.js';
import { createCard } from './components/card.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { getUser, getInitialCards, updateUser, addCard, updateAvatar } from './components/api.js';

// DOM
const cardsContainer = document.querySelector('.places__list');

// Popups
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');
const imagePopup = document.querySelector('.popup_type_image');

// Cached elements of image preview popup
const previewImage = imagePopup?.querySelector('.popup__image');
const previewCaption = imagePopup?.querySelector('.popup__caption');

function handlePreview(name, link) {
  if (!previewImage || !previewCaption) return;
  previewImage.src = link;
  previewImage.alt = name;
  previewCaption.textContent = name;
  openModal(imagePopup);
}


// Forms
const editForm = editPopup?.querySelector('.popup__form');
const addForm = addPopup?.querySelector('.popup__form');
const avatarForm = avatarPopup?.querySelector('.popup__form');

// Inputs
const nameInput = editForm?.querySelector('.popup__input_type_name');
const aboutInput = editForm?.querySelector('.popup__input_type_description');
const placeNameInput = addForm?.querySelector('.popup__input_type_card-name');
const placeLinkInput = addForm?.querySelector('.popup__input_type_url');
const avatarLinkInput = avatarForm?.querySelector('.popup__input_type_avatar-url');

// Profile elements
const profileName = document.querySelector('.profile__title');
const profileAbout = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

// Buttons
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__avatar-edit');

let currentUserId = null;

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
  errorSuffix: '-error'
};

// Set patterns and custom messages dynamically to avoid relying on markup
const nameLikePattern = '^[A-Za-zА-Яа-яЁё\\-\\s]+$';
[nameInput, aboutInput, placeNameInput].forEach((inp) => {
  if (!inp) return;
  inp.setAttribute('pattern', nameLikePattern);
  inp.dataset.errorPattern = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
});


// Helpers
const renderCard = (data, toStart = false) => {
  const card = createCard(data, currentUserId, { onPreview: handlePreview });
  toStart ? cardsContainer.prepend(card) : cardsContainer.append(card);
};

const setLoading = (button, text) => {
  if (!button) return ({});
  const original = button.textContent;
  button.textContent = text;
  return { restore: () => (button.textContent = original) };
};

// Openers
editButton?.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileAbout.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editPopup);
});
addButton?.addEventListener('click', () => {
  addForm.reset();
  clearValidation(addForm, validationConfig);
  openModal(addPopup);
});
avatarEditButton?.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// Submits
editForm?.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const btn = editForm.querySelector(validationConfig.submitButtonSelector);
  const loader = setLoading(btn, 'Сохранение...');
  updateUser({ name: nameInput.value.trim(), about: aboutInput.value.trim() })
    .then((user) => {
      profileName.textContent = user.name;
      profileAbout.textContent = user.about;
      closeModal(editPopup);
    })
    .catch(console.error)
    .finally(loader.restore);
});

addForm?.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const btn = addForm.querySelector(validationConfig.submitButtonSelector);
  const loader = setLoading(btn, 'Сохранение...');
  addCard({ name: placeNameInput.value.trim(), link: placeLinkInput.value.trim() })
    .then((card) => {
      renderCard(card, true);
      addForm.reset();
      clearValidation(addForm, validationConfig);
      closeModal(addPopup);
    })
    .catch(console.error)
    .finally(loader.restore);
});

avatarForm?.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const btn = avatarForm.querySelector(validationConfig.submitButtonSelector);
  const loader = setLoading(btn, 'Сохранение...');
  updateAvatar(avatarLinkInput.value.trim())
    .then((user) => {
      profileAvatar.style.backgroundImage = `url(${user.avatar})`;
      closeModal(avatarPopup);
    })
    .catch(console.error)
    .finally(loader.restore);
});

// Init
Promise.all([getUser(), getInitialCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;
    profileName.textContent = user.name;
    profileAbout.textContent = user.about;
    if (user.avatar) profileAvatar.style.backgroundImage = `url(${user.avatar})`;
    cards.reverse().forEach(renderCard); // старые вниз, новые вверх
  })
  .catch(console.error);

enableValidation(validationConfig);
setModalCloseHandlers();
