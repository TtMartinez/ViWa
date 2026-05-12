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
function agregarAlCarrito(nombre, precio, cantidad = 1) {
    let prod = carrito.find(p => p.nombre === nombre);

    if (prod) {
        prod.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio: Number(precio), cantidad });
    }

    guardarCarrito();
    actualizarContador();

    alert(`${cantidad} producto(s) agregado(s) al carrito`);
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

/* Abrir modal de pago */
function abrirModalPago() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    document.getElementById("modal-pago").classList.remove("hidden");
}

/* Cerrar modal de pago */
function cerrarModalPago() {
    document.getElementById("modal-pago").classList.add("hidden");
    document.querySelectorAll('input[name="pago"]').forEach(r => r.checked = false);
}

/* Confirmar pago */
function confirmarPago() {
    let seleccion = document.querySelector('input[name="pago"]:checked');

    if (!seleccion) {
        alert("Por favor seleccioná un método de pago");
        return;
    }

    let metodoPago = seleccion.value;
    cerrarModalPago();
    enviarWhatsApp(metodoPago);
}

/* WhatsApp */
function enviarWhatsApp(metodoPago) {
    let mensaje = "Hola! Quiero comprar:\n\n";

    carrito.forEach(prod => {
        let subtotal = prod.precio * prod.cantidad;
        mensaje += `- ${prod.nombre} x${prod.cantidad} ($${formatearPrecioWA(prod.precio)}) = $${formatearPrecioWA(subtotal)}\n`;
    });

    let total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    mensaje += `\nTotal: $${formatearPrecioWA(total)}`;
    mensaje += `\nForma de pago: ${metodoPago}`;

    let url = `https://wa.me/5493462645379?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

/* Inicial — inyecta el modal en el DOM */
document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", `
        <div id="modal-pago" class="hidden">
            <div id="modal-pago-contenido">
                <h3>¿Cómo vas a pagar?</h3>
                <label><input type="radio" name="pago" value="Transferencia"> Transferencia</label>
                <label><input type="radio" name="pago" value="Efectivo"> Efectivo</label>
                <div>
                    <button onclick="confirmarPago()">Confirmar</button>
                    <button onclick="cerrarModalPago()">Cancelar</button>
                </div>
            </div>
        </div>
    `);

    actualizarContador();
});