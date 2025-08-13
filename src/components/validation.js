// src/components/validation.js (rev2)
// Включение валидации всех форм и утилита очистки ошибок
// Создаём элементы ошибок динамически, если их нет в разметке

const ensureErrorElement = (form, input, config) => {
  // ищем подходящий спан рядом или по id
  let errorEl = input.nextElementSibling;
  if (!(errorEl && errorEl.classList && errorEl.classList.contains('popup__error'))) {
    errorEl = form.querySelector(`#${input.id || input.name}-error`);
  }
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'popup__error';
    errorEl.id = `${input.id || input.name}-error`;
    input.insertAdjacentElement('afterend', errorEl);
  }
  return errorEl;
};

const showError = (form, input, config) => {
  const errorEl = ensureErrorElement(form, input, config);
  errorEl.textContent = input.validationMessage;
  input.classList.add(config.inputErrorClass);
  errorEl.classList.add(config.errorClass);
};

const hideError = (form, input, config) => {
  const errorEl = ensureErrorElement(form, input, config);
  errorEl.textContent = '';
  input.classList.remove(config.inputErrorClass);
  errorEl.classList.remove(config.errorClass);
};

const setButtonState = (form, submitButton, config) => {
  const isValid = form.checkValidity();
  if (isValid) {
    submitButton.disabled = false;
    submitButton.classList.remove(config.inactiveButtonClass);
  } else {
    submitButton.disabled = true;
    submitButton.classList.add(config.inactiveButtonClass);
  }
};

const getPatternErrorMessage = (input) => {
  return input.dataset.errorPattern || 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
};

const validateInput = (form, input, config) => {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(getPatternErrorMessage(input));
  } else {
    input.setCustomValidity('');
  }
  if (!input.validity.valid) {
    showError(form, input, config);
  } else {
    hideError(form, input, config);
  }
};

const setEventListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);
  setButtonState(form, submitButton, config);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      validateInput(form, input, config);
      setButtonState(form, submitButton, config);
    });
  });
};

export const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    // включаем novalidate на всякий случай, управление берём на себя
    form.setAttribute('novalidate', 'novalidate');
    setEventListeners(form, config);
  });
};

export const clearValidation = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.setCustomValidity('');
    hideError(form, input, config);
  });
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add(config.inactiveButtonClass);
  }
};
