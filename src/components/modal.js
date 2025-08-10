
export function openModal(modal) {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const opened = document.querySelector('.popup.popup_is-opened');
    if (opened) closeModal(opened);
  }
}

export function setModalCloseHandlers() {
  document.querySelectorAll('.popup').forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
      if (evt.target.classList.contains('popup__close') || evt.target === popup) {
        closeModal(popup);
      }
    });
  });
}
