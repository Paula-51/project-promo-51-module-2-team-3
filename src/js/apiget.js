const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get("id");

async function getCardData(uuid) {
    try {
      const response = await fetch(`https://dev.adalab.es/api/info/${uuid}`);
      const result = await response.json();
  
      if (result.success) {
        paintCard(result.data); // Pinta los datos si va bien
      } else {
        console.error("❌ Error: Tarjeta no encontrada");
        document.querySelector("#card").textContent = "❌ Tarjeta no encontrada";
      }
    } catch (error) {
      console.error("❌ Error al cargar la tarjeta:", error.message);
      document.querySelector("#card").textContent = "❌ Error al cargar la tarjeta";
    }
  }

  //funcion para pintar los datos en la tarjeta 
  function paintCard(data) {
    document.querySelector("#name").textContent = data.field2;
    document.querySelector("#sign").textContent = data.field3;
    document.querySelector("#birthdate").textContent = data.field4;
    document.querySelector("#mobile").textContent = data.field5;
    document.querySelector("#instagram").textContent = data.field6;
    document.querySelector("#color").style.backgroundColor = data.field7;
    document.querySelector("#photo").src = data.photo || "default.jpg"; // o una imagen por defecto
  }

  //ejecución de la función
  if (uuid) {
    getCardData(uuid);
  } else {
    document.querySelector("#card").textContent = "❌ No se encontró el ID de la tarjeta en la URL.";
  }
  