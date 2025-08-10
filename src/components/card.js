
export function createCard({ name, link }, handleLike, handleDelete, handlePreview) {
  const template = document.querySelector('#card-template').content.querySelector('.card');
  const card = template.cloneNode(true);
  const img = card.querySelector('.card__image');
  const title = card.querySelector('.card__title');
  const likeBtn = card.querySelector('.card__like-button');
  const deleteBtn = card.querySelector('.card__delete-button');

  img.src = link;
  img.alt = name;
  title.textContent = name;

  likeBtn.addEventListener('click', (evt) => handleLike(evt));
  deleteBtn.addEventListener('click', (evt) => handleDelete(evt));
  img.addEventListener('click', () => handlePreview(name, link));

  return card;
}

export function handleLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export function handleDelete(evt) {
  evt.target.closest('.card').remove();
}
