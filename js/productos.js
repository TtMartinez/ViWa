const PROJECT_ID = "bh05ol1a";
const DATASET    = "production";

function sanityImgUrl(ref) {
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${ref
    .replace("image-", "")
    .replace(/-(\w+)$/, ".$1")}`;
}

async function cargarProductos() {
  const query = encodeURIComponent('*[_type == "product"] | order(_createdAt asc)');
  const url   = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${query}`;

  try {
    const res        = await fetch(url);
    const { result } = await res.json();

    ["herbales", "cremosos", "exfoliantes", "balsamos"].forEach(cat => {
      document.getElementById(`grid-${cat}`).innerHTML = "";
    });

    result.forEach(prod => {
      const imgUrl = sanityImgUrl(prod.imagen.asset._ref);
      const grid   = document.getElementById(`grid-${prod.categoria}`);

      if (!grid) return;

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