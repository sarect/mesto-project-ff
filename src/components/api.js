// src/components/api.js
const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-39',
  headers: {
    authorization: '7acb1ba7-61db-42f2-a1fd-7a080b037d00',
    'Content-Type': 'application/json'
  }
};

const check = (res) => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);

// Пользователь
export const getUser = () => fetch(`${config.baseUrl}/users/me`, { headers: config.headers }).then(check);
export const updateUser = ({ name, about }) => fetch(`${config.baseUrl}/users/me`, {
  method: 'PATCH',
  headers: config.headers,
  body: JSON.stringify({ name, about })
}).then(check);

export const updateAvatar = (avatar) => fetch(`${config.baseUrl}/users/me/avatar`, {
  method: 'PATCH',
  headers: config.headers,
  body: JSON.stringify({ avatar })
}).then(check);

// Карточки
export const getInitialCards = () => fetch(`${config.baseUrl}/cards`, { headers: config.headers }).then(check);
export const addCard = ({ name, link }) => fetch(`${config.baseUrl}/cards`, {
  method: 'POST',
  headers: config.headers,
  body: JSON.stringify({ name, link })
}).then(check);
export const deleteCard = (cardId) => fetch(`${config.baseUrl}/cards/${cardId}`, {
  method: 'DELETE',
  headers: config.headers
}).then(check);
export const likeCard = (cardId) => fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
  method: 'PUT',
  headers: config.headers
}).then(check);
export const unlikeCard = (cardId) => fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
  method: 'DELETE',
  headers: config.headers
}).then(check);
