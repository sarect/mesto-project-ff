
export function openModal(modal) {
  modal.classList.add('popup_soft');
  // Force reflow before adding opened for transition to kick in
  void modal.offsetWidth;
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  // wait for CSS transition (0.6s) then remove helper to restore display:none
  setTimeout(() => {
    modal.classList.remove('popup_soft');
  }, 600);
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
