  // 1. Obtener el ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get("id");

// 2. Seleccionar elementos del DOM
const nameEl = document.getElementById("name");
const signEl = document.getElementById("sign");
const birthdateEl = document.getElementById("birthdate");
const mobileEl = document.getElementById("mobile");
const instagramEl = document.getElementById("instagram");
const colorEl = document.getElementById("color");
const photoEl = document.getElementById("photo");
const cardSection = document.getElementById("card");

// 3. Obtener los datos desde la API
async function getCardData() {
  try {
    const response = await fetch(`https://dev.adalab.es/api/info/${uuid}`);
    const result = await response.json();

    if (result.success) {
      const data = result.data;

      // 4. Pintar los datos en la tarjeta
      nameEl.textContent = data.field2 || "Nombre no disponible";
      signEl.textContent = `Signo: ${data.field3}`;
      birthdateEl.textContent = `Fecha de nacimiento: ${data.field4}`;
      mobileEl.textContent = `📱 ${data.field5}`;
      instagramEl.textContent = `📸 @${data.field6}`;
      colorEl.textContent = `🎨 Color favorito: ${data.field7}`;

      // Pintar imagen como fondo de un div circular
      if (data.photo) {
        photoEl.style.backgroundImage = `url(${data.photo})`;
      }

      // 5. Añadir la clase del elemento para el fondo visual (agua, fuego, etc.)
      switch (data.field1) {
        case 1:
          cardSection.classList.add("agua");
          break;
        case 2:
          cardSection.classList.add("fuego");
          break;
        case 3:
          cardSection.classList.add("tierra");
          break;
        case 4:
          cardSection.classList.add("aire");
          break;
        default:
          break;
      }
    } else {
      nameEl.textContent = "❌ No se pudo cargar la tarjeta.";
    }
  } catch (error) {
    nameEl.textContent = `❌ Error: ${error.message}`;
  }
}

// 6. Ejecutar la función
getCardData();
