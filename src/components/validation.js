// Функции валидации — все селекторы и классы берём из config

const getErrorElement = (form, input, config) => {
  if (!input.id) return null;
  return form.querySelector(`#${input.id}${config.errorSuffix || '-error'}`);
};

const showError = (form, input, config) => {
  const errorEl = getErrorElement(form, input, config);
  if (!errorEl) return;
  errorEl.textContent = input.validationMessage;
  input.classList.add(config.inputErrorClass);
  errorEl.classList.add(config.errorClass);
};

const hideError = (form, input, config) => {
  const errorEl = getErrorElement(form, input, config);
  if (!errorEl) return;
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
