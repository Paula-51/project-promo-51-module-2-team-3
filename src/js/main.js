"use strict";

// Alternar seções
function toggleSection(btnClass, contentClass) {
  const button = document.querySelector(`.${btnClass}`);
  const content = document.querySelector(`.${contentClass}`);
  const icon = button.querySelector("i");

  button.addEventListener("click", () => {
    content.classList.toggle("collapsed");
    icon.classList.toggle("fa-arrow-up");
    icon.classList.toggle("fa-arrow-down");
  });
}

toggleSection("js_toggleDesign", "js_containerDesign");
toggleSection("js_toggleFill", "js_containerFill");
toggleSection("js_toggleShare", "js_containerShare");

// Atualizar preview de texto
function updatePreview(inputSelector, previewSelector, transformFn) {
  const input = document.querySelector(inputSelector);
  const preview = document.querySelector(previewSelector);
  if (!input || !preview) return;

  const update = () => {
    let value = input.value;
    if (transformFn) value = transformFn(value);
    preview.textContent = value || preview.getAttribute("data-placeholder");
  };

  input.addEventListener("input", update);
  input.addEventListener("change", update);
  update();
}

// Atualizar imagem
const imageInput = document.querySelector("#image");
const imagePreview = document.querySelector(".preview__card img");

if (imageInput && imagePreview) {
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
}

// Campos do formulário → preview + localStorage
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

// Inputs com preview
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

// Cor
const colorInput = document.querySelector("#color");
if (colorInput) {
  const savedColor = localStorage.getItem("form_color");
  if (savedColor) colorInput.value = savedColor;
  colorInput.addEventListener("input", () => {
    localStorage.setItem("form_color", colorInput.value);
  });
}

// Signos com emojis reais e nomes em português
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

const signoInput = document.querySelector("#signo-zodiacal");
const signoPreview = document.querySelector(".js_signoPreview");

if (signoInput && signoPreview) {
  const savedSigno = localStorage.getItem("form_signo");
  if (savedSigno) signoInput.value = savedSigno;

  const updateSigno = () => {
    const signo = signoInput.value;
    localStorage.setItem("form_signo", signo);

    if (signo && signosConIconos[signo]) {
      signoPreview.textContent = signosConIconos[signo];
    } else {
      signoPreview.textContent = signoPreview.getAttribute("data-placeholder");
    }
  };

  signoInput.addEventListener("change", updateSigno);
  updateSigno();
}

// Reset botão
const resetButton = document.querySelector(".preview button");
const form = document.querySelector(".js_containerFill form");

if (resetButton && form) {
  resetButton.addEventListener("click", () => {
    form.reset();

    if (imagePreview) {
      imagePreview.src = "https://placecats.com/100/100";
    }

    document.querySelectorAll(".preview__card p").forEach((preview) => {
      preview.textContent = preview.getAttribute("data-placeholder");
    });

    localStorage.clear();
  });
}

// Restaurar imagem do localStorage ao carregar
window.addEventListener("load", () => {
  const savedImage = localStorage.getItem("imageData");
  if (savedImage && imagePreview) {
    imagePreview.src = savedImage;
  }
});

// === ENVIAR FORMULÁRIO E OBTER URL DA TARJETA ===

const formBtn = document.querySelector(".js_formBtn");
const shareSection = document.querySelector(".js_containerShare");
const urlOutput = document.createElement("p");
urlOutput.style.wordBreak = "break-word";
shareSection.appendChild(urlOutput);

formBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  urlOutput.textContent = "⏳ Criando tarjeta...";

  const dataToSend = {
    field1: 0,
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
      urlOutput.innerHTML = `✅ Tarjeta criada: <a href="${url}" target="_blank">${url}</a>`;
    } else {
      urlOutput.textContent = `❌ Erro: ${result.error}`;
    }
  } catch (error) {
    urlOutput.textContent = "❌ Erro ao criar a tarjeta: " + error.message;
  }
});
