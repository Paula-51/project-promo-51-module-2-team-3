<<<<<<< HEAD
"use strict";

const imageInput = document.querySelector(".js_image");
const imagePreview = document.querySelector(".js_preview__cardimg");
const colorInput = document.querySelector(".js_color");
const signoInput = document.querySelector(".js_signo-zodiacal");
const signoPreview = document.querySelector(".js_signoPreview");
const resetButton = document.querySelector(".js_resetBtn");
const form = document.querySelector(".js_containerFill form");
const formBtn = document.querySelector(".js_formBtn");
const shareSection = document.querySelector(".js_containerShare");
const previewCard = document.querySelector(".js_preview_card");
const elementRadios = document.querySelectorAll('input[name="elemento"]');


const signosConIconos = {
  aries: "Aries ♈",
  tauro: "Touro ♉",
  geminis: "Geminis ♊",
  cancer: "Cancer ♋",
  leo: "Leo ♌",
  virgo: "Virgo ♍",
  libra: "Libra ♎",
  escorpio: "Escorpio ♏",
  sagitario: "Sagitario ♐",
  capricornio: "Capricórnio ♑",
  acuario: "Acuario ♒",
  piscis: "Piscis ♓",
};

// Crear elemento "p" para generar la ul de la tarjeta
const urlOutput = document.createElement("p");
urlOutput.style.wordBreak = "break-word";
if (shareSection) {
  shareSection.appendChild(urlOutput);
}

// Funciones

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
  const selectedRadio = document.querySelector('input[name="elemento"]:checked');
  if (!selectedRadio || !previewCard) return;

  previewCard.classList.remove("agua", "fuego", "tierra", "aire");
  previewCard.classList.add(selectedRadio.value);
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
  if (!imageInput || !imagePreview) return;

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.src = reader.result;
        localStorage.setItem("imageData", reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "https://placecats.com/100/100";
      localStorage.removeItem("imageData");
    }
  });

  window.addEventListener("load", () => {
    const savedImage = localStorage.getItem("imageData");
    if (savedImage) {
      imagePreview.src = savedImage;
    } else {
      imagePreview.src = "https://placecats.com/100/100";
    }
  });
}

function initColor() {
  if (!colorInput) return;
  const savedColor = localStorage.getItem("form_color");
  if (savedColor) colorInput.value = savedColor;

  colorInput.addEventListener("input", () => {
    localStorage.setItem("form_color", colorInput.value);
  });
}

function initReset() {
  if (!resetButton || !form || !imagePreview) return;

  resetButton.addEventListener("click", () => {
    form.reset();

    imagePreview.src = "https://placecats.com/100/100";

    document.querySelectorAll(".preview__card p").forEach((preview) => {
      const placeholder = preview.getAttribute("data-placeholder");
      if (placeholder) preview.textContent = placeholder;
    });

    localStorage.clear();
  });
}

async function sendFormData(event) {
  event.preventDefault();

  urlOutput.textContent = "⏳ Criando tarjeta...";

  const selectedDesign = document.querySelector(
    'input[name="elemento"]:checked'
  );
  const field1Value = selectedDesign ? selectedDesign.value : "";

  const dataToSend = {
    field1: field1Value,
    field2: document.querySelector("#name").value,
    field3: document.querySelector("#signo-zodiacal").value,
    field4: document.querySelector("#birthDate").value,
    field5: document.querySelector("#mobileNumber").value,
    field6: document.querySelector("#instagram").value,
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
      const url = `https://dev.adalab.es/api/info/${result.infoID}`;
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
elementRadios.forEach(radio => {
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
=======
"use strict";

const imageInput = document.querySelector(".js_image");
const imagePreview = document.querySelector(".js_preview__cardimg");
const colorInput = document.querySelector(".js_color");
const signoInput = document.querySelector(".js_signo-zodiacal");
const signoPreview = document.querySelector(".js_signoPreview");
const resetButton = document.querySelector(".js_resetBtn");
const form = document.querySelector(".js_containerFill form");
const formBtn = document.querySelector(".js_formBtn");
const shareSection = document.querySelector(".js_containerShare");
const previewCard = document.querySelector(".js_preview_card");
const elementRadios = document.querySelectorAll('input[name="elemento"]');


const signosConIconos = {
  aries: "Aries ♈",
  tauro: "Touro ♉",
  geminis: "Geminis ♊",
  cancer: "Cancer ♋",
  leo: "Leo ♌",
  virgo: "Virgo ♍",
  libra: "Libra ♎",
  escorpio: "Escorpio ♏",
  sagitario: "Sagitario ♐",
  capricornio: "Capricórnio ♑",
  acuario: "Acuario ♒",
  piscis: "Piscis ♓",
};

// Crear elemento "p" para generar la ul de la tarjeta
const urlOutput = document.createElement("p");
urlOutput.style.wordBreak = "break-word";
if (shareSection) {
  shareSection.appendChild(urlOutput);
}

// Funciones

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
  const selectedRadio = document.querySelector('input[name="elemento"]:checked');
  if (!selectedRadio || !previewCard) return;

  previewCard.classList.remove("agua", "fuego", "tierra", "aire");
  previewCard.classList.add(selectedRadio.value);
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
  if (!imageInput || !imagePreview) return;

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.src = reader.result;
        localStorage.setItem("imageData", reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "https://placecats.com/100/100";
      localStorage.removeItem("imageData");
    }
  });

  window.addEventListener("load", () => {
    const savedImage = localStorage.getItem("imageData");
    if (savedImage) {
      imagePreview.src = savedImage;
    } else {
      imagePreview.src = "https://placecats.com/100/100";
    }
  });
}

function initColor() {
  if (!colorInput) return;
  const savedColor = localStorage.getItem("form_color");
  if (savedColor) colorInput.value = savedColor;

  colorInput.addEventListener("input", () => {
    localStorage.setItem("form_color", colorInput.value);
  });
}

function initReset() {
  if (!resetButton || !form || !imagePreview) return;

  resetButton.addEventListener("click", () => {
    form.reset();

    imagePreview.src = "https://placecats.com/100/100";

    document.querySelectorAll(".preview__card p").forEach((preview) => {
      const placeholder = preview.getAttribute("data-placeholder");
      if (placeholder) preview.textContent = placeholder;
    });

    localStorage.clear();
  });
}

async function sendFormData(event) {
  event.preventDefault();

  urlOutput.textContent = "⏳ Criando tarjeta...";

  const selectedDesign = document.querySelector(
    'input[name="elemento"]:checked'
  );
  const field1Value = selectedDesign ? selectedDesign.value : "";

  const dataToSend = {
    field1: field1Value,
    field2: document.querySelector("#name").value,
    field3: document.querySelector("#signo-zodiacal").value,
    field4: document.querySelector("#birthDate").value,
    field5: document.querySelector("#mobileNumber").value,
    field6: document.querySelector("#instagram").value,
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
      const url = `https://dev.adalab.es/api/info/${result.infoID}`;
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
elementRadios.forEach(radio => {
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
>>>>>>> afa3f142067ffc8d7b2256f980a44c19680294cb
