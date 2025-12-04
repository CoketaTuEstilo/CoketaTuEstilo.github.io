/* ========================================
   LÓGICA JAVASCRIPT - Carrito y WhatsApp
   ========================================
*/

// Número de WhatsApp de la empresa (¡IMPORTANTE: Reemplazar con el tuyo!)
const NUMERO_EMPRESA = "5493834786741"; 

// Base de Datos de Productos
const productosDisponibles = [
    { id: 1, nombre: "Lápiz Labial Mate", precio: 25.00, img: "mujer_skala_1.jpg" }, 
    { id: 2, nombre: "Collar Elegante Perlas", precio: 55.50, img: "skala_crema2.jpg" }, 
    { id: 3, nombre: "Bolsa de Mano Piel", precio: 120.99, img: "skala_crema3.jpg" },
    { id: 4, nombre: "Perfume Esencial Floral", precio: 80.75, img: "skala_crema4.jpg" },
    { id: 5, nombre: "Perfume Esencial negro", precio: 82.75, img: "skala_crema5.jpg" },
]; 

let carrito = [];

// ===================================
// FUNCIONES DE INTERFAZ Y VISUALIZACIÓN
// ===================================

// Renderiza las tarjetas de producto con animación AOS
function renderizarProductos() {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = productosDisponibles.map((p, index) => `
        <div class="producto-card" data-aos="fade-up" data-aos-delay="${index * 150}">
            
            <div class="producto-imagen-container">
                <img src="${p.img}" alt="${p.nombre}">
            </div>

            <div class="producto-detalle">
                <h3>${p.nombre}</h3>
                <p>$${p.precio.toFixed(2)}</p>
            </div>
            
            <button class="btn btn-principal" 
                    onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio})">
                Agregar al Carrito
            </button>
        </div>
    `).join('');
}

// Actualiza la lista del carrito
function actualizarVistaCarrito() {
    const lista = document.querySelector('#carrito-list ul');
    const contador = document.getElementById('carrito-contador');
    const subtotalElement = document.getElementById('carrito-subtotal');
    const vacioMensaje = document.getElementById('carrito-vacio');
    let subtotal = 0;
    let totalItems = 0;
    
    lista.innerHTML = '';
    
    if (carrito.length === 0) {
        vacioMensaje.style.display = 'block';
    } else {
        vacioMensaje.style.display = 'none';
        carrito.forEach(item => {
            const li = document.createElement('li');
            const itemTotal = item.precio * item.cantidad;
            subtotal += itemTotal;
            totalItems += item.cantidad;

            li.innerHTML = `
                **${item.nombre}** <br>(${item.cantidad} x $${item.precio.toFixed(2)}) 
                - <strong style="color: var(--color-texto);">$${itemTotal.toFixed(2)}</strong>
            `;
            lista.appendChild(li);
        });
    }

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    contador.textContent = totalItems;
    
    document.getElementById('resumen-pedido').classList.remove('visible');
}

// Muestra/Oculta la barra lateral del carrito
function toggleCarrito() {
    const sidebar = document.getElementById('carrito-sidebar');
    sidebar.classList.toggle('abierto');
}

// ===================================
// FUNCIONES DE LÓGICA DEL CARRITO
// ===================================

function agregarAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    actualizarVistaCarrito();
}

// ===================================
// FUNCIÓN CLAVE: GENERAR LINK DE WHATSAPP
// ===================================
function mostrarTotalYLink() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de finalizar.");
        return;
    }

    let total = 0;
    let mensaje = `¡Hola! Quiero confirmar mi pedido:\n\n`;
    
    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;
        mensaje += `* ${item.nombre} (Cant: ${item.cantidad}) - Subtotal: $${itemTotal.toFixed(2)}\n`;
    });
    
    mensaje += `\n*TOTAL FINAL: $${total.toFixed(2)}*\n\n`;
    mensaje += `Por favor, confirmar disponibilidad y forma de pago. ¡Gracias!`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${NUMERO_EMPRESA}&text=${mensajeCodificado}`;

    const resumenDiv = document.getElementById('resumen-pedido');
    resumenDiv.innerHTML = `
        <h3>✅ ¡Pedido Casi Listo!</h3>
        <p>Total a Pagar: <strong style="color: #ff6a88; font-size: 1.5em;">$${total.toFixed(2)}</strong></p>
        <p>Copia el enlace o usa el botón directo para enviar tu pedido:</p>
        <textarea id="whatsappLink" readonly>${whatsappURL}</textarea>
        <button class="btn btn-principal" onclick="copiarLink()">
            📋 Copiar Enlace
        </button>
        <a href="${whatsappURL}" target="_blank" class="cta-whatsapp btn">
            🟢 Abrir WhatsApp
        </a>
    `;
    
    resumenDiv.classList.add('visible');
}

function copiarLink() {
    const link = document.getElementById('whatsappLink');
    link.select();
    link.setSelectionRange(0, 99999);
    
    try {
        document.execCommand("copy");
        alert("¡Enlace copiado al portapapeles!");
    } catch (err) {
        console.error('Error al copiar: ', err);
        alert("No se pudo copiar automáticamente. Por favor, copia el texto manualmente.");
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // La función que crea los productos se llama aquí:
    renderizarProductos(); 
    actualizarVistaCarrito();
});

/* ===================================
// FUNCIÓN NUEVA: ANIMACIÓN VOLANDO AL CARRITO
// =================================== */

function animateFlyToCart(targetElement) {
    const carritoIcon = document.getElementById('carrito-icon');
    const targetRect = targetElement.getBoundingClientRect(); // Posición inicial del producto
    const cartRect = carritoIcon.getBoundingClientRect();     // Posición final del carrito

    // Crear la imagen fantasma que volará
    const flyImg = document.createElement('img');
    flyImg.src = targetElement.querySelector('img').src; // Usamos la imagen del producto
    flyImg.classList.add('fly-to-cart-effect');
    
    // Establecer la posición inicial de la imagen
    flyImg.style.left = `${targetRect.left}px`;
    flyImg.style.top = `${targetRect.top}px`;
    
    document.body.appendChild(flyImg);

    // Forzar un repaint para asegurar que la posición inicial sea aplicada antes de la transición
    void flyImg.offsetWidth; 

    // Aplicar la posición final (donde la imagen "vuela")
    flyImg.style.left = `${cartRect.left + 10}px`; 
    flyImg.style.top = `${cartRect.top + 10}px`;
    flyImg.style.opacity = '0';
    flyImg.style.transform = 'scale(0.2)'; // La imagen se hace pequeña al llegar

    // Eliminar la imagen después de que termine la animación
    setTimeout(() => {
        flyImg.remove();
        
        // Efecto visual rápido en el icono del carrito para confirmar la llegada
        carritoIcon.classList.add('pulse-animation');
        setTimeout(() => {
             carritoIcon.classList.remove('pulse-animation');
        }, 300);

    }, 800); // El tiempo debe coincidir con la duración de la transición en CSS
}
// --------------------------------------------------------------------------------

// Modificar la función agregarAlCarrito para que llame a la animación
function agregarAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    // OBTENER EL ELEMENTO PARA INICIAR LA ANIMACIÓN
    const clickedButton = event.target; // El botón "Agregar" que se presionó
    const productCard = clickedButton.closest('.producto-card'); // La tarjeta completa
    
    // Llamar a la nueva función de animación
    if (productCard) {
        animateFlyToCart(productCard);
    }
    
    actualizarVistaCarrito();
}