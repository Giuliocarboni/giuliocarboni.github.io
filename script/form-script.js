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

  // Ottimizzazione UX: Rimuove l'errore dinamicamente mentre l'utente scrive
  input.addEventListener("focus", function () {
    this.classList.remove("input-error");
    this.placeholder = this.dataset.originalPlaceholder;
  });
});

// Inizializzazione EmailJS
emailjs.init({
  publicKey: "IvHqYaMH_Vi6tGikO",
});

const form = document.getElementById("contact-form");

// Il codice del form viene eseguito SOLO se il form esiste nella pagina corrente
if (form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  let toastTimeout;

  function showToast(messaggio, tipo = "success") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    if (!toast || !toastMessage) return;

    clearTimeout(toastTimeout);

    toastMessage.textContent = messaggio;

    // Sicuro: rimuove solo le classi di stato senza distruggere le altre
    toast.classList.remove("success", "error", "show");

    // Forza il rinfresco del rendering del browser (per far ripartire eventuali animazioni CSS)
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

    // 🛡️ Sicurezza: Controllo防 crash se reCAPTCHA viene bloccato da AdBlock
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
    const originalBtnText = submitBtn.innerHTML;
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
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
  });
}
