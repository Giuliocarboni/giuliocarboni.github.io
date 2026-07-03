const inputs = document.querySelectorAll(".fs-input, .fs-textarea");

inputs.forEach((input) => {
  input.dataset.originalPlaceholder = input.placeholder;

  input.addEventListener("invalid", function (event) {
    event.preventDefault();
    this.classList.add("input-error");
    if (this.value.trim() === "") {
      this.placeholder = "Compila questo campo";
    }
  });

  input.addEventListener("focus", function () {
    this.classList.remove("input-error");
    this.placeholder = this.dataset.originalPlaceholder;
  });
});

emailjs.init({
  publicKey: "IvHqYaMH_Vi6tGikO",
});

const form = document.getElementById("contact-form");

if (form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  let toastTimeout;

  function showToast(messaggio, tipo = "success") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    if (!toast || !toastMessage) return;

    clearTimeout(toastTimeout);

    toastMessage.textContent = messaggio;

    toast.classList.remove("success", "error", "show");

    void toast.offsetWidth;

    toast.classList.add(tipo, "show");

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 5000);
  }

  function isEmailValid(email) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const emailValue = emailInput.value.trim();

    if (!isEmailValid(emailValue)) {
      showToast("Per favore, inserisci un indirizzo email valido.", "error");
      emailInput.classList.add("input-error");
      return;
    }

    if (typeof grecaptcha === "undefined") {
      showToast(
        "Errore di sicurezza: reCAPTCHA non caricato. Disattiva eventuali blocchi pubblicitari o verifica la tua connessione.",
        "error",
      );
      return;
    }

    const captchaResponse = grecaptcha.getResponse();

    if (captchaResponse.length === 0) {
      showToast("Per favore, completa il controllo reCaptcha.", "error");
      return;
    }

    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Invio in corso...";

    emailjs
      .sendForm("service_1eztssc", "template_byq0lc2", form)
      .then(() => {
        showToast(
          "Messaggio inviato con successo, grazie per avermi contattato!",
          "success",
        );
        form.reset();
        grecaptcha.reset();
      })
      .catch((error) => {
        showToast("Errore durante l'invio. Riprova.", "error");
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      });
  });
}
