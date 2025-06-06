"use strict";

const imageInput = document.querySelector(".js_image");
const imagePreview = document.querySelector(".js__profile-image");
const colorInput = document.querySelector(".js_color");
const signoInput = document.querySelector(".js_signo-zodiacal");
const signoPreview = document.querySelector(".js_signoPreview");
const resetButton = document.querySelector(".js_resetBtn");
const form = document.querySelector(".js_containerFill form");
const formBtn = document.querySelector(".js_formBtn");
const shareSection = document.querySelector(".js_containerShare");
const previewCard = document.querySelector(".js_preview_card");
const elementRadios = document.querySelectorAll('input[name="elemento"]');
const eligeFondoElement = document.querySelector(".js_containerDesign");
const linkCard = document.querySelector(".js_viewBtn");

const signosConIconos = {
  aries: "Aries ♈",
  tauro: "Tauro ♉",
  geminis: "Geminis ♊",
  cancer: "Cancer ♋",
  leo: "Leo ♌",
  virgo: "Virgo ♍",
  libra: "Libra ♎",
  escorpio: "Escorpio ♏",
  sagitario: "Sagitario ♐",
  capricornio: "Capricornio ♑",
  acuario: "Acuario ♒",
  piscis: "Piscis ♓",
};

const elementoMap = {
  agua: 1,
  fuego: 2,
  tierra: 3,
  aire: 4,
};

// Crear elemento "p" para mostrar URL
const urlOutput = document.createElement("p");
urlOutput.style.wordBreak = "break-word";
if (shareSection) {
  shareSection.appendChild(urlOutput);
}

// Función para formatear Instagram
function formatInstagram(val) {
  if (!val) return "";
  if (val.startsWith("@")) return val;
  return "@" + val;
}

function toggleSection(btnClass, contentClass) {
  const button = document.querySelector(`.${btnClass}`);
  const content = document.querySelector(`.${contentClass}`);
  if (!button || !content) return;
  const icon = button.querySelector("i");

  button.addEventListener("click", () => {
    content.classList.toggle("collapsed");
    if (icon) {
      icon.classList.toggle("fa-arrow-up");
      icon.classList.toggle("fa-arrow-down");
    }
  });
}

function updateCardBackground() {
  const selectedRadio = document.querySelector(
    'input[name="elemento"]:checked'
  );
  if (!selectedRadio || !previewCard) return;

  previewCard.classList.remove("agua", "fuego", "tierra", "aire");
  previewCard.classList.add(selectedRadio.value.toLowerCase());
}

function connectInputToPreviewAndStorage(
  inputSelector,
  previewSelector,
  storageKey,
  transformFn
) {
  const input = document.querySelector(inputSelector);
  const preview = document.querySelector(previewSelector);
  if (!input || !preview) return;

  const saved = localStorage.getItem(storageKey);
  if (saved) input.value = saved;

  const update = () => {
    let value = input.value;
    if (transformFn) value = transformFn(value);
    preview.textContent = value || preview.getAttribute("data-placeholder");
    localStorage.setItem(storageKey, input.value);
  };

  input.addEventListener("input", update);
  input.addEventListener("change", update);
  update();
}

function updateSigno() {
  if (!signoInput || !signoPreview) return;

  const signo = signoInput.value;
  localStorage.setItem("form_signo", signo);

  if (signo && signosConIconos[signo]) {
    signoPreview.textContent = signosConIconos[signo];
  } else {
    signoPreview.textContent = signoPreview.getAttribute("data-placeholder");
  }
}

function initImage() {
  const imageInput = document.querySelector(".js_image");
  const imagePreview = document.querySelector(".js__profile-image");
  const imageMini = document.querySelector(".js__profile-preview");

  if (!imageInput || !imagePreview || !imageMini) return;

  window.addEventListener("load", () => {
    const savedImage = localStorage.getItem("imageData");
    if (savedImage) {
      imagePreview.src = savedImage;
      imageMini.style.backgroundImage = `url("${savedImage}")`;
    } else {
      imagePreview.src = "https://placecats.com/100/100";
      imageMini.style.backgroundImage = `url("https://placecats.com/100/100")`;
    }
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        imagePreview.src = imageData;
        imageMini.style.backgroundImage = `url("${imageData}")`;
        localStorage.setItem("imageData", imageData);
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "https://placecats.com/100/100";
      imageMini.style.backgroundImage = `url("https://placecats.com/100/100")`;
      localStorage.removeItem("imageData");
    }
  });
}

function initColor() {
  if (!colorInput || !imagePreview || !previewCard) return;

  const cardImage = document.querySelector(".preview__card img");

  const savedColor = localStorage.getItem("form_color");
  if (savedColor) {
    colorInput.value = savedColor;
    imagePreview.style.borderColor = savedColor;
    if (cardImage) cardImage.style.borderColor = savedColor;
    previewCard.style.borderColor = savedColor;
    previewCard.style.boxShadow = `0 0 10px ${savedColor}`;
  }

  colorInput.addEventListener("input", () => {
    const newColor = colorInput.value;
    imagePreview.style.borderColor = newColor;
    if (cardImage) cardImage.style.borderColor = newColor;
    previewCard.style.borderColor = newColor;
    previewCard.style.boxShadow = `0 0 10px ${newColor}`;
    localStorage.setItem("form_color", newColor);
  });
}

function initReset() {
  if (!resetButton || !form) return;

  resetButton.addEventListener("click", () => {
    form.reset();

    document.querySelectorAll(".preview__card p").forEach((preview) => {
      const placeholder = preview.getAttribute("data-placeholder");
      if (placeholder) preview.textContent = placeholder;
    });

    localStorage.removeItem("form_name");
    localStorage.removeItem("form_birthDate");
    localStorage.removeItem("form_mobileNumber");
    localStorage.removeItem("form_instagram");
    localStorage.removeItem("form_color");
    localStorage.removeItem("form_signo");
    localStorage.removeItem("imageData");

    const imagePreview = document.querySelector(".js__profile-image");
    const imageMini = document.querySelector(".js__profile-preview");

    const defaultImage = "https://placecats.com/100/100";

    if (imagePreview) {
      imagePreview.src = defaultImage;
    }

    if (imageMini) {
      imageMini.style.backgroundImage = `url("${defaultImage}")`;
    }


    if (previewCard) {
      previewCard.style.borderColor = "";
      previewCard.style.boxShadow = "";
    }

    localStorage.clear();
  });
}

async function sendFormData(event) {
  event.preventDefault();

  urlOutput.textContent = "⏳ Creando tarjeta...";

  const selectedDesign = document.querySelector(
    'input[name="elemento"]:checked'
  );
  const field1Value = selectedDesign
    ? elementoMap[selectedDesign.value.toLowerCase()]
    : 0;

const valueMap = {
  "agua": 1,
  "fuego": 2,
  "tierra": 3,
  "aire": 4
};

const mappedValue = valueMap[field1Value] || 0; // 0 si el valor no es válido

// Ahora puedes enviar mappedValue a la API


  const dataToSend = {
    field1: mappedValue,
    field2: document.querySelector("#name").value,
    field3: document.querySelector("#signo-zodiacal").value,
    field4: document.querySelector("#birthDate").value,
    field5: document.querySelector("#mobileNumber").value,
    field6: formatInstagram(document.querySelector("#instagram").value),
    field7: document.querySelector("#color").value,
    photo: localStorage.getItem("imageData") || "",
  };


  try {
    const response = await fetch("https://dev.adalab.es/api/info/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (result.success) {
      const url = `card.html?id=${result.infoID}`;
      urlOutput.innerHTML = `✅ Tarjeta creada: <a href="${url}" target="_blank">${url}</a>`;
    } else {
      urlOutput.textContent = `❌ Error: ${result.error}`;
    }
  } catch (error) {
    urlOutput.textContent = "❌ Error al crear la tarjeta: " + error.message;
  }
}

// Ejecución

toggleSection("js_toggleDesign", "js_containerDesign");
toggleSection("js_toggleFill", "js_containerFill");
toggleSection("js_toggleShare", "js_containerShare");

connectInputToPreviewAndStorage("#name", ".js_namePreview", "form_name");
connectInputToPreviewAndStorage(
  "#birthDate",
  ".js_datePreview",
  "form_birthDate",
  (val) => {
    if (!val) return "";
    const date = new Date(val);
    return date.toLocaleDateString();
  }
);
connectInputToPreviewAndStorage(
  "#mobileNumber",
  ".js_mobilePreview",
  "form_mobileNumber"
);
connectInputToPreviewAndStorage(
  "#instagram",
  ".js_igPreview",
  "form_instagram",
  (val) => (val ? (val.startsWith("@") ? val : "@" + val) : "")
);

updateCardBackground();

updateCardBackground();
elementRadios.forEach((radio) => {
  radio.addEventListener("change", updateCardBackground);
});

initImage();
initColor();

if (signoInput && signoPreview) {
  const savedSigno = localStorage.getItem("form_signo");
  if (savedSigno) signoInput.value = savedSigno;
  signoInput.addEventListener("change", updateSigno);
  updateSigno();
}

initReset();

if (formBtn) {
  formBtn.addEventListener("click", sendFormData);
}
