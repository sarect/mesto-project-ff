import "./pages/index.css";
import { createCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  createEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getCards,
  getProfile,
  postCard,
  editProfile,
  likeCardApi,
  unlikeCardApi,
  deleteCardApi,
  editAvatar,
} from "./components/api.js";

/* 
 * Элементы DOM для работы с интерфейсом:
 * - Контейнеры карточек мест
 * - Элементы профиля пользователя
 */
const places = document.querySelector(".places");
const placesList = places.querySelector(".places__list");
const profileName = document.querySelector(".profile__title");
const profileAbout = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

// Кнопки открытия модальных окон
const buttonAddCard = document.querySelector(".profile__add-button");
const buttonEditProfile = document.querySelector(".profile__edit-button");

// Модальные окна приложения
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupEditProfile = document.querySelector(".popup_type_edit");
const popupImage = document.querySelector(".popup_type_image");

/**
 * Элементы формы редактирования профиля:
 * - Поля ввода имени и описания
 * - Кнопка отправки формы
 */
const formEditProfile = document.forms["edit-profile"];
const nameInput = formEditProfile.elements.name;
const jobInput = formEditProfile.elements.description;
const submitEditProfile = formEditProfile.querySelector(".popup__button");

/**
 * Элементы формы добавления новой карточки:
 * - Поля ввода названия и ссылки на изображение
 * - Кнопка отправки формы
 */
const formCreateCard = document.forms["new-place"];
const cardNameInput = formCreateCard.elements["place-name"];
const cardUrlInput = formCreateCard.elements.link;
const submitCreateCard = formCreateCard.querySelector(".popup__button");

// Элементы для отображения увеличенного изображения карточки
const imageInPopupImage = popupImage.querySelector(".popup__image");
const captionPopupImage = popupImage.querySelector(".popup__caption");

/**
 * Элементы формы обновления аватара:
 * - Поле ввода ссылки на новый аватар
 * - Кнопка отправки формы
 */
const popupAvatar = document.querySelector(".popup_type_edit-avatar");
const formEditAvatar = document.forms["new-avatar"];
const avatarUrlInput = formEditAvatar.elements["avatar-link"];
const submitEditAvatar = formEditAvatar.querySelector(".popup__button");

/**
 * Конфигурация валидации форм:
 * - Селекторы элементов форм
 * - Классы для стилизации ошибок
 */
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

let userId; // Идентификатор текущего пользователя

// Загрузка начальных данных: карточек и информации о профиле
const promises = [getCards(), getProfile()];

/**
 * Открывает модальное окно с увеличенным изображением карточки
 * @param {Object} cardInfo - Объект с данными карточки (название, ссылка на изображение)
 */
const onOpenPreview = (cardInfo) => {
  imageInPopupImage.src = cardInfo.link;
  imageInPopupImage.alt = cardInfo.name;
  captionPopupImage.textContent = cardInfo.name;
  openModal(popupImage);
};

/**
 * Обрабатывает удаление карточки
 * @param {HTMLElement} cardElement - DOM-элемент карточки
 * @param {string} cardId - Идентификатор карточки
 */
function handleDeleteCard(cardElement, cardId) {
  deleteCardApi(cardId)
    .then(() => {
      cardElement.remove(); // Удаление карточки из DOM после успешного ответа сервера
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    });
}

/**
 * Обрабатывает лайк/дизлайк карточки
 * @param {Event} event - Событие клика по кнопке лайка
 */
function handleCardLike(event) {
  const likeButton = event.target;
  const cardElement = likeButton.closest(".card");
  const cardId = cardElement.dataset.cardId;
  const likeCounter = cardElement.querySelector(".card__like-number");

  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const apiMethod = isLiked ? unlikeCardApi : likeCardApi;

  likeButton.disabled = true; // Блокировка кнопки во время запроса

  apiMethod(cardId)
    .then((updatedCard) => {
      likeCounter.textContent = updatedCard.likes.length; // Обновление счетчика лайков
      likeButton.classList.toggle("card__like-button_is-active"); // Переключение состояния кнопки
    })
    .catch((err) => {
      console.error("Ошибка при обработке лайка:", err);
    })
    .finally(() => {
      likeButton.disabled = false; // Разблокировка кнопки после завершения запроса
    });
}

/**
 * Устанавливает состояние кнопки во время выполнения запроса
 * @param {boolean} isLoading - Флаг выполнения запроса
 * @param {HTMLButtonElement} button - Кнопка, состояние которой нужно изменить
 */
const setButtonState = (isLoading, button) => {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
  button.disabled = isLoading;
};

/**
 * Обработчик отправки формы редактирования профиля
 * @param {Event} event - Событие отправки формы
 */
const onEditProfileFormSubmit = (event) => {
  event.preventDefault();

  const profileInfo = {
    name: nameInput.value,
    about: jobInput.value,
  };

  setButtonState(true, submitEditProfile);

  editProfile(profileInfo)
    .then(() => {
      profileName.textContent = profileInfo.name;
      profileAbout.textContent = profileInfo.about;
      closeModal(popupEditProfile);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    })
    .finally(() => {
      setButtonState(false, submitEditProfile);
    });
};

/**
 * Обработчик отправки формы добавления новой карточки
 * @param {Event} event - Событие отправки формы
 */
const onCreateCardFormSubmit = (event) => {
  event.preventDefault();

  const cardInfo = {
    name: cardNameInput.value,
    link: cardUrlInput.value,
  };

  setButtonState(true, submitCreateCard);

  postCard(cardInfo)
    .then((cardData) => {
      // Добавление флагов принадлежности и состояния лайка для новой карточки
      cardData.isMine = true;
      cardData.isLiked = false;
      cardData.numberLikes = 0;

      const newCard = createCard(
        cardData,
        handleDeleteCard,
        onOpenPreview,
        handleCardLike
      );
      placesList.prepend(newCard);
      closeModal(popupNewCard);
      formCreateCard.reset();
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      setButtonState(false, submitCreateCard);
    });
};

/**
 * Обработчик отправки формы обновления аватара
 * @param {Event} event - Событие отправки формы
 */
const onEditAvatarFormSubmit = (event) => {
  event.preventDefault();

  setButtonState(true, submitEditAvatar);
  const avatarUrl = avatarUrlInput.value;

  editAvatar({ avatar: avatarUrl })
    .then((userData) => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(popupAvatar);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
    })
    .finally(() => {
      setButtonState(false, submitEditAvatar);
    });
};

// Инициализация приложения: загрузка данных и настройка интерфейса
Promise.all(promises)
  .then(([cardsData, userData]) => {
    userId = userData._id; // Сохранение ID текущего пользователя
    
    // Обработка и отображение карточек
    cardsData.forEach((item) => {
      item.numberLikes = item.likes.length;
      item.isMine = item.owner._id === userId;
      item.isLiked = item.likes.some((obj) => obj._id === userId);

      const newCard = createCard(
        item,
        handleDeleteCard,
        onOpenPreview,
        handleCardLike
      );
      placesList.append(newCard);
    });

    // Заполнение данных профиля
    profileName.textContent = userData.name;
    profileAbout.textContent = userData.about;
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;
  })
  .catch((err) => {
    console.error("Ошибка при загрузке начальных данных:", err);
  });

// Настройка обработчиков модальных окон
createEventListeners(popupEditProfile);
createEventListeners(popupNewCard);
createEventListeners(popupImage);
createEventListeners(popupAvatar);

// Обработчики открытия модальных окон
buttonAddCard.addEventListener("click", () => {
  formCreateCard.reset();
  clearValidation(formCreateCard, validationConfig);
  openModal(popupNewCard);
});

buttonEditProfile.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileAbout.textContent;
  clearValidation(formEditProfile, validationConfig);
  openModal(popupEditProfile);
});

profileImage.addEventListener("click", () => {
  formEditAvatar.reset();
  clearValidation(formEditAvatar, validationConfig);
  openModal(popupAvatar);
});

// Подписка на события отправки форм
formEditProfile.addEventListener("submit", onEditProfileFormSubmit);
formCreateCard.addEventListener("submit", onCreateCardFormSubmit);
formEditAvatar.addEventListener("submit", onEditAvatarFormSubmit);

// Включение валидации всех форм
enableValidation(validationConfig);