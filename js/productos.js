const PROJECT_ID = "bh05ol1a";
const DATASET    = "production";

const CATEGORIAS = {
  "herbales.html":    "herbales",
  "cremosos.html":    "cremosos",
  "exfoliantes.html": "exfoliantes",
  "balsamos.html":    "balsamos",
  "textiles.html":    "textiles",
  "gelducha.html":    "gel",
  "rituales.html":    "rituales",
  "salesbanio.html":  "sales",
};

function sanityImgUrl(ref) {
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${ref
    .replace("image-", "")
    .replace(/-(\w+)$/, ".$1")}`;
}

function abrirModal(nombre, precio, imgUrl, descripcion, ingredientes, sabores) {
  // Resetear cantidad
  document.getElementById("modal-cantidad-valor").innerText = "1";
  document.getElementById("modal-img").src            = imgUrl;
  document.getElementById("modal-nombre").innerText   = nombre;
  document.getElementById("modal-precio").innerText   = `$${precio.toLocaleString("es-AR")}`;
  document.getElementById("modal-descripcion").innerText  = descripcion || "Sin descripción.";
  document.getElementById("modal-ingredientes").innerText = ingredientes || "Sin especificar.";

  // Sabores
  const contenedorSabores = document.getElementById("modal-sabores-contenedor");
  const selectSabores     = document.getElementById("modal-sabores-select");

  if (sabores && sabores.length > 0) {
    selectSabores.innerHTML = sabores.map((s, i) =>
      `<option value="${i}">${s.nombre}</option>`
    ).join("");

    selectSabores.onchange = () => {
      const s = sabores[selectSabores.value];
      document.getElementById("modal-descripcion").innerText  = s.descripcion  || "Sin descripción.";
      document.getElementById("modal-ingredientes").innerText = s.ingredientes || "Sin especificar.";
    };

    const primero = sabores[0];
    document.getElementById("modal-descripcion").innerText  = primero.descripcion  || "Sin descripción.";
    document.getElementById("modal-ingredientes").innerText = primero.ingredientes || "Sin especificar.";

    contenedorSabores.classList.remove("hidden");
  } else {
    contenedorSabores.classList.add("hidden");
  }

  document.getElementById("modal-btn-agregar").onclick = () => {
    let nombreFinal = nombre;
    if (sabores && sabores.length > 0) {
      nombreFinal += ` - ${sabores[selectSabores.value].nombre}`;
    }
    const cantidad = parseInt(document.getElementById("modal-cantidad-valor").innerText);
    agregarAlCarrito(nombreFinal, precio, cantidad);
    cerrarModal();
  };

  document.getElementById("producto-modal").classList.remove("hidden");
}

function cerrarModal() {
  document.getElementById("producto-modal").classList.add("hidden");
}

function cambiarCantidadModal(delta) {
  const span = document.getElementById("modal-cantidad-valor");
  const actual = parseInt(span.innerText);
  const nuevo = actual + delta;
  if (nuevo >= 1) span.innerText = nuevo;
}

function crearCard(prod) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.onclick = () => abrirModal(
    prod.nombre,
    prod.precio,
    sanityImgUrl(prod.imagen.asset._ref),
    prod.descripcion || "",
    prod.ingredientes || "",
    prod.sabores || []
  );

  card.innerHTML = `
    <img src="${sanityImgUrl(prod.imagen.asset._ref)}" alt="${prod.nombre}" class="product-img">
    <h3>${prod.nombre}</h3>
    <p>$${prod.precio.toLocaleString("es-AR")}</p>
  `;

  return card;
}

async function cargarProductos() {
  const pagina    = window.location.pathname.split("/").pop();
  const categoria = CATEGORIAS[pagina];
  if (!categoria) return;

  const esBalsamos = pagina === "balsamos.html";

  const query = encodeURIComponent(
    `*[_type == "product" && categoria == "${categoria}"] | order(_createdAt asc)`
  );
  const url = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${query}`;

  try {
    const res        = await fetch(url);
    const { result } = await res.json();

    if (esBalsamos) {
      ["labial", "corporal", "exfoliantes"].forEach(sub => {
        document.getElementById(`grid-${sub}`).innerHTML = "";
      });

      result.forEach(prod => {
        const grid = document.getElementById(`grid-${prod.subcategoria}`);
        if (!grid) return;
        grid.appendChild(crearCard(prod));
      });

      ["labial", "corporal", "exfoliantes"].forEach(sub => {
        const grid = document.getElementById(`grid-${sub}`);
        if (grid && grid.children.length === 0) {
          grid.innerHTML = "<p>No hay productos en esta categoría todavía.</p>";
        }
      });

    } else {
      const grid = document.getElementById("products-grid");
      grid.innerHTML = "";

      if (result.length === 0) {
        grid.innerHTML = "<p>No hay productos en esta categoría todavía.</p>";
        return;
      }

      result.forEach(prod => grid.appendChild(crearCard(prod)));
    }

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  document.getElementById("producto-modal").addEventListener("click", function(e) {
    if (e.target === this) cerrarModal();
  });
});
