// src/components/card.js
import { likeCard, unlikeCard, deleteCard as apiDeleteCard } from './api.js';

const isLikedByMe = (likes, myId) => likes.some((u) => u._id === myId);

export function createCard(data, currentUserId, { onPreview }) {
  const { name, link, likes = [], _id, owner } = data;
  const template = document.querySelector('#card-template').content.querySelector('.card');
  const card = template.cloneNode(true);
  const img = card.querySelector('.card__image');
  const title = card.querySelector('.card__title');
  const likeBtn = card.querySelector('.card__like-button');
  const deleteBtn = card.querySelector('.card__delete-button');
  const likeCounter = card.querySelector('.card__like-count') || (() => {
    const counter = document.createElement('span');
    counter.className = 'card__like-count';
    card.querySelector('.card__description').appendChild(counter);
    return counter;
  })();

  img.src = link;
  img.onload = () => img.classList.add('card__image--ready');
  img.alt = name;
  title.textContent = name;

  // delete button visibility
  if (!owner || owner._id !== currentUserId) {
    deleteBtn.remove();
  }

  // like state
  if (isLikedByMe(likes, currentUserId)) {
    likeBtn.classList.add('card__like-button_is-active');
  }
  likeCounter.textContent = likes.length;

  // handlers
  likeBtn.addEventListener('click', () => {
    const liked = likeBtn.classList.contains('card__like-button_is-active');
    const req = liked ? unlikeCard(_id) : likeCard(_id);
    req.then((updated) => {
      likeBtn.classList.toggle('card__like-button_is-active', isLikedByMe(updated.likes, currentUserId));
      likeCounter.textContent = updated.likes.length;
    }).catch(console.error);
  });

  deleteBtn && deleteBtn.addEventListener('click', () => {
    // подтверждение удаления реализуется модальным окном при желании
    apiDeleteCard(_id)
      .then(() => card.remove())
      .catch(console.error);
  });

  img.addEventListener('click', () => onPreview && onPreview(name, link));

  return card;
}
