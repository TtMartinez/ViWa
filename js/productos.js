const PROJECT_ID = "bh05ol1a";
const DATASET    = "production";

const CATEGORIAS = {
  "herbales.html":    "herbales",
  "cremosos.html":    "cremosos",
  "exfoliantes.html": "exfoliantes",
  "balsamos.html":    "balsamos",
  "textiles.html":    "textiles",
  "gel.html":         "gel",
  "rituales.html":    "rituales",
  "sales.html":       "sales",
};

function sanityImgUrl(ref) {
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${ref
    .replace("image-", "")
    .replace(/-(\w+)$/, ".$1")}`;
}

function abrirModal(nombre, precio, imgUrl, descripcion, ingredientes) {
  document.getElementById("modal-img").src         = imgUrl;
  document.getElementById("modal-nombre").innerText  = nombre;
  document.getElementById("modal-precio").innerText  = `$${precio.toLocaleString("es-AR")}`;
  document.getElementById("modal-descripcion").innerText = descripcion || "Sin descripción.";
  document.getElementById("modal-ingredientes").innerText = ingredientes || "Sin especificar.";
  document.getElementById("modal-btn-agregar").onclick = () => {
    agregarAlCarrito(nombre, precio);
    cerrarModal();
  };
  document.getElementById("producto-modal").classList.remove("hidden");
}

function cerrarModal() {
  document.getElementById("producto-modal").classList.add("hidden");
}

async function cargarProductos() {
  const pagina    = window.location.pathname.split("/").pop();
  const categoria = CATEGORIAS[pagina];

  if (!categoria) return;

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
        <div class="product-card" onclick="abrirModal(
          '${prod.nombre.replace(/'/g, "\\'")}',
          ${prod.precio},
          '${imgUrl}',
          '${(prod.descripcion || "").replace(/'/g, "\\'").replace(/\n/g, " ")}',
          '${(prod.ingredientes || "").replace(/'/g, "\\'").replace(/\n/g, " ")}'
        )">
          <img src="${imgUrl}" alt="${prod.nombre}" class="product-img">
          <h3>${prod.nombre}</h3>
          <p>$${prod.precio.toLocaleString("es-AR")}</p>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  // Cerrar modal clickeando afuera
  document.getElementById("producto-modal").addEventListener("click", function(e) {
    if (e.target === this) cerrarModal();
  });
});