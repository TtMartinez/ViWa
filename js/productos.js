const PROJECT_ID = "bh05ol1a";
const DATASET    = "production";

// Mapa página → categoría
const CATEGORIAS = {
  "herbales.html":    "herbales",
  "cremosos.html":    "cremosos",
  "exfoliantes.html": "exfoliantes",
  "balsamos.html":    "balsamos",
};

function sanityImgUrl(ref) {
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${ref
    .replace("image-", "")
    .replace(/-(\w+)$/, ".$1")}`;
}

async function cargarProductos() {
  // Detectar categoría según el archivo actual
  const pagina   = window.location.pathname.split("/").pop();
  const categoria = CATEGORIAS[pagina];

  if (!categoria) return; // no es una página de categoría

  const query = encodeURIComponent(
    `*[_type == "product" && categoria == "${categoria}"] | order(_createdAt asc)`
  );
  const url = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${query}`;

  try {
    const res        = await fetch(url);
    const { result } = await res.json();
    const grid       = document.getElementById("products-grid");

    grid.innerHTML = "";

    if (result.length === 0) {
      grid.innerHTML = "<p>No hay productos en esta categoría todavía.</p>";
      return;
    }

    result.forEach(prod => {
      const imgUrl = sanityImgUrl(prod.imagen.asset._ref);

      grid.innerHTML += `
        <div class="product-card">
          <img src="${imgUrl}" alt="${prod.nombre}" class="product-img">
          <h3>${prod.nombre}</h3>
          ${prod.descripcion ? `<p class="product-desc">${prod.descripcion}</p>` : ""}
          <p>$${prod.precio.toLocaleString("es-AR")}</p>
          <button onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})">
            Agregar
          </button>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarProductos);