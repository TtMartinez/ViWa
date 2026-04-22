let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* Formatear precios (para el carrito visual) */
function formatearPrecio(num) {
    return num.toLocaleString("es-AR");
}

/* Formatear precios (para WhatsApp, sin punto de miles) */
function formatearPrecioWA(num) {
    return num.toLocaleString("es-AR").replace(/\./g, "");
}

/* Guardar */
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* Agregar */
function agregarAlCarrito(nombre, precio) {
    let prod = carrito.find(p => p.nombre === nombre);

    if (prod) {
        prod.cantidad++;
    } else {
        carrito.push({ nombre, precio: Number(precio), cantidad: 1 });
    }

    guardarCarrito();
    actualizarContador();

    alert("Producto agregado al carrito");
}

/* Abrir */
function abrirCarrito() {
    document.getElementById("carrito-panel").classList.remove("hidden");
    renderCarrito();
}

/* Cerrar */
function cerrarCarrito() {
    document.getElementById("carrito-panel").classList.add("hidden");
}

/* Render */
function renderCarrito() {
    let contenedor = document.getElementById("carrito-items");
    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach((prod, index) => {
        let subtotal = prod.precio * prod.cantidad;
        total += subtotal;

        contenedor.innerHTML += `
            <div style="margin-bottom:10px; border-bottom:1px solid #ccc; padding-bottom:5px;">
                <strong>${prod.nombre}</strong><br>
                $${formatearPrecio(prod.precio)} x 
                <input type="number" value="${prod.cantidad}" min="1"
                onchange="cambiarCantidad(${index}, this.value)">
                
                = <strong>$${formatearPrecio(subtotal)}</strong>
                
                <button onclick="eliminarProducto(${index})">❌</button>
            </div>
        `;
    });

    document.getElementById("carrito-total").innerText = formatearPrecio(total);
}

/* Cambiar cantidad */
function cambiarCantidad(index, cantidad) {
    carrito[index].cantidad = parseInt(cantidad);
    guardarCarrito();
    renderCarrito();
    actualizarContador();
}

/* Eliminar */
function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderCarrito();
    actualizarContador();
}

/* Contador */
function actualizarContador() {
    let totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    document.getElementById("contador-carrito").innerText = totalItems;
}

/* WhatsApp */
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let mensaje = "Hola! Quiero comprar:\n\n";

    carrito.forEach(prod => {
        let subtotal = prod.precio * prod.cantidad;
        mensaje += `- ${prod.nombre} x${prod.cantidad} ($${formatearPrecioWA(prod.precio)}) = $${formatearPrecioWA(subtotal)}\n`;
    });

    let total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    mensaje += `\nTotal: $${formatearPrecioWA(total)}`;

    let telefono = "5493462645379";

    let url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
}

/* Inicial */
document.addEventListener("DOMContentLoaded", () => {
    actualizarContador();
});