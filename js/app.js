
let contadorProductos = 0;
let contadorFacturas = 1;

// Catálogo de productos almacenado en el navegador
let productos = JSON.parse(
    localStorage.getItem("productos")
) || [];

const RUC_EMISOR = "1723441703";

const NOMBRE_EMISOR =
    "Gabriel Antonio Endara Guevara";

const DIRECCION_EMISOR =
    "Quito, Isabel Herreria y S34K OE13-120";


function colocarFechaActual() {

    const fecha = new Date();

    const anio =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    document.getElementById("fecha").value =
        `${anio}-${mes}-${dia}`;
}
// Agrega una nueva fila de producto
function agregarProducto() {

    contadorProductos++;

    const lista =
        document.getElementById(
            "listaProductos"
        );

    const fila =
        document.createElement("tr");

    fila.id =
        "producto-" + contadorProductos;


    // Creamos dinámicamente las celdas del producto
 fila.innerHTML = `

    <td>

        <input
            type="number"
            class="cantidad"
            value="1"
            min="1"
        >

    </td>


    <td>

        <select
            class="productoSeleccionado"
        >

            <option value="">
                Seleccione un producto
            </option>

            ${productos.map(producto => `

                <option value="${producto.id}">

                    ${producto.codigo} -
                    ${producto.nombre}

                </option>

            `).join("")}

        </select>

    </td>


    <td>

        <input
            type="number"
            class="precio"
            value="0"
            min="0"
            step="0.01"
            readonly
        >

    </td>


    <td>

        <select
            class="iva"
            disabled
        >

            <option value="15">
                15%
            </option>

            <option value="0">
                0%
            </option>

        </select>

    </td>


    <td>

        <span class="totalProducto">
            0.00
        </span>

    </td>


    <td>

        <button
            type="button"
            onclick="eliminarProducto(${contadorProductos})"
        >
            Eliminar
        </button>

    </td>

`;


    lista.appendChild(fila);

    agregarEventosFila(fila);
}


// Agrega a cada producto
// Configura los eventos de una fila de producto
function agregarEventosFila(fila) {

    const cantidad =
        fila.querySelector(".cantidad");

    const precio =
        fila.querySelector(".precio");

    const iva =
        fila.querySelector(".iva");

    const productoSeleccionado =
        fila.querySelector(
            ".productoSeleccionado"
        );


    // Cuando cambia el producto,
    // cargamos automáticamente sus datos
    productoSeleccionado.addEventListener(
        "change",
        function () {

            cargarDatosProducto(
                fila
            );

            calcularTotales();
        }
    );


    cantidad.addEventListener(
        "input",
        calcularTotales
    );

    precio.addEventListener(
        "input",
        calcularTotales
    );

}
// Calcula subtotal, IVA y total de la factura
function calcularTotales() {

    const filas =
        document.querySelectorAll(
            "#listaProductos tr"
        );

    let subtotal = 0;
    let ivaTotal = 0;


    filas.forEach(fila => {

        const cantidad =
            Number(
                fila.querySelector(
                    ".cantidad"
                ).value
            );

        const precio =
            Number(
                fila.querySelector(
                    ".precio"
                ).value
            );

        const porcentajeIva =
            Number(
                fila.querySelector(
                    ".iva"
                ).value
            );


        const subtotalProducto =
            cantidad * precio;

        const ivaProducto =
            subtotalProducto *
            porcentajeIva / 100;

        const totalProducto =
            subtotalProducto +
            ivaProducto;


        fila.querySelector(
            ".totalProducto"
        ).textContent =
            totalProducto.toFixed(2);


        subtotal += subtotalProducto;

        ivaTotal += ivaProducto;

    });


    const total =
        subtotal + ivaTotal;


    document.getElementById(
        "subtotal"
    ).textContent =
        subtotal.toFixed(2);

    document.getElementById(
        "ivaTotal"
    ).textContent =
        ivaTotal.toFixed(2);

    document.getElementById(
        "totalFactura"
    ).textContent =
        total.toFixed(2);
}

// Elimina un producto de la factura
function eliminarProducto(id) {

    const fila =
        document.getElementById(
            "producto-" + id
        );


    if (fila) {
        fila.remove();
    }


    calcularTotales();
}

// Genera una factura y la muestra en pantalla
function generarFactura() {

    // Datos del emisor
    const ruc =
        RUC_EMISOR;

    const razonSocial =
        NOMBRE_EMISOR;

    const direccion =
        DIRECCION_EMISOR;


    // Datos generales de la factura
    const numeroFactura =
        document.getElementById(
            "numeroFactura"
        ).value;

    const fecha =
        document.getElementById(
            "fecha"
        ).value;


    // Datos del cliente
    const identificacionCliente =
        document.getElementById(
            "identificacionCliente"
        ).value.trim();

    const nombreCliente =
        document.getElementById(
            "nombreCliente"
        ).value.trim();

    const direccionCliente =
        document.getElementById(
            "direccionCliente"
        ).value.trim();

    const correoCliente =
        document.getElementById(
            "correoCliente"
        ).value.trim();


    // Totales calculados
    const subtotal =
        document.getElementById(
            "subtotal"
        ).textContent;

    const iva =
        document.getElementById(
            "ivaTotal"
        ).textContent;

    const total =
        document.getElementById(
            "totalFactura"
        ).textContent;


    // Validamos que exista un cliente
    if (nombreCliente === "") {

        alert(
            "Ingrese el nombre del cliente."
        );

        return;
    }
    // Validamos que exista al menos un producto
    const filas =
        document.querySelectorAll(
            "#listaProductos tr"
        );

    if (filas.length === 0) {

        alert(
            "Debe agregar al menos un producto."
        );

        return;
    }


    // Construimos el detalle de productos
    let productosHTML = "";


    filas.forEach(fila => {

        const cantidad =
            fila.querySelector(
                ".cantidad"
            ).value;

        const descripcion =
            fila.querySelector(
                ".descripcion"
            ).value.trim();

        const precio =
            fila.querySelector(
                ".precio"
            ).value;

        const ivaProducto =
            fila.querySelector(
                ".iva"
            ).value;

        const totalProducto =
            fila.querySelector(
                ".totalProducto"
            ).textContent;


        // No agregamos productos sin descripción
        if (descripcion === "") {
            return;
        }


        productosHTML += `

            <tr>

                <td>
                    ${cantidad}
                </td>

                <td>
                    ${descripcion}
                </td>

                <td>
                    $${Number(precio).toFixed(2)}
                </td>

                <td>
                    ${ivaProducto}%
                </td>

                <td>
                    $${totalProducto}
                </td>

            </tr>

        `;
    });
    // Creamos el contenedor de la nueva factura
    const facturasGeneradas =
        document.getElementById(
            "facturasGeneradas"
        );

    const factura =
        document.createElement("div");

    factura.className =
        "factura-generada";


    // Construimos visualmente la factura
    factura.innerHTML = `

        <h3>
            FACTURA ${numeroFactura}
        </h3>

        <p>
            <strong>Fecha:</strong>
            ${fecha}
        </p>

        <hr>

        <h4>
            DATOS DEL EMISOR
        </h4>

        <p>
            <strong>Nombre:</strong>
            ${razonSocial}
        </p>

        <p>
            <strong>RUC:</strong>
            ${ruc}
        </p>

        <p>
            <strong>Dirección:</strong>
            ${direccion}
        </p>

        <h4>
            DATOS DEL CLIENTE
        </h4>

        <p>
            <strong>Identificación:</strong>
            ${identificacionCliente}
        </p>

        <p>
            <strong>Nombre:</strong>
            ${nombreCliente}
        </p>

        <p>
            <strong>Dirección:</strong>
            ${direccionCliente}
        </p>

        <p>
            <strong>Correo:</strong>
            ${correoCliente}
        </p>

        <h4>
            DETALLE
        </h4>

        <table>

            <thead>

                <tr>

                    <th>Cantidad</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>IVA</th>
                    <th>Total</th>

                </tr>

            </thead>

            <tbody>
                ${productosHTML}
            </tbody>

        </table>

        <div class="total-final">

            <p>
                Subtotal:
                $${subtotal}
            </p>

            <p>
                IVA:
                $${iva}
            </p>

            <h2>
                TOTAL:
                $${total}
            </h2>

        </div>
    `;


    // Mostramos la factura más reciente primero
    facturasGeneradas.prepend(factura);


    // Preparamos el número de la siguiente factura
    contadorFacturas++;

    const siguienteNumero =
        String(
            contadorFacturas
        ).padStart(9, "0");


    document.getElementById(
        "numeroFactura"
    ).value =
        `001-001-${siguienteNumero}`;


    // Limpiamos los datos para crear otra factura
    limpiarFormulario();
}


// Limpia los datos variables de la factura
function limpiarFormulario() {

    document.getElementById(
        "identificacionCliente"
    ).value = "";

    document.getElementById(
        "nombreCliente"
    ).value = "";

    document.getElementById(
        "direccionCliente"
    ).value = "";

    document.getElementById(
        "correoCliente"
    ).value = "";

    document.getElementById(
        "listaProductos"
    ).innerHTML = "";

    document.getElementById(
        "subtotal"
    ).textContent = "0.00";

    document.getElementById(
        "ivaTotal"
    ).textContent = "0.00";

    document.getElementById(
        "totalFactura"
    ).textContent = "0.00";

    colocarFechaActual();
}

// Guarda un nuevo producto en el catálogo
function guardarProducto() {

    const codigo =
        document.getElementById(
            "codigoProducto"
        ).value.trim();

    const nombre =
        document.getElementById(
            "nombreProducto"
        ).value.trim();

    const precio =
        Number(
            document.getElementById(
                "precioProducto"
            ).value
        );

    const iva =
        Number(
            document.getElementById(
                "ivaProducto"
            ).value
        );


    // Validamos los datos obligatorios
    if (
        codigo === "" ||
        nombre === "" ||
        precio <= 0
    ) {

        alert(
            "Complete correctamente los datos del producto."
        );

        return;
    }


    // Verificamos que el código no esté repetido
    const productoExiste =
        productos.some(
            producto =>
                producto.codigo === codigo
        );


    if (productoExiste) {

        alert(
            "Ya existe un producto con ese código."
        );

        return;
    }


    // Creamos el nuevo producto
    const nuevoProducto = {

        id: Date.now(),
        codigo: codigo,
        nombre: nombre,
        precio: precio,
        iva: iva

    };


    // Agregamos el producto al catálogo
    productos.push(nuevoProducto);

    // Guardamos el catálogo en el navegador
    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    // Limpiamos los campos
    document.getElementById(
        "codigoProducto"
    ).value = "";

    document.getElementById(
        "nombreProducto"
    ).value = "";

    document.getElementById(
        "precioProducto"
    ).value = "";

    // Actualizamos la pantalla
    mostrarProductos();

    alert(
        "Producto guardado correctamente."
    );
}

// Muestra todos los productos registrados
function mostrarProductos() {

    const lista =
        document.getElementById(
            "listaCatalogo"
        );

    // Si no existen productos mostramos un mensaje
    if (productos.length === 0) {

        lista.innerHTML = `
            <p>
                No existen productos registrados.
            </p>
        `;
        return;
    }

    // Limpiamos la lista antes de volver a construirla
    lista.innerHTML = "";

    // Recorremos todos los productos
    productos.forEach(producto => {

        const elemento =
            document.createElement("div");

        elemento.className =
            "producto-item";

        elemento.innerHTML = `

            <span class="producto-codigo">
                ${producto.codigo}
            </span>

            <span class="producto-nombre">
                ${producto.nombre}
            </span>

            <span class="producto-precio">
                $${producto.precio.toFixed(2)}
            </span>

            <span>
                IVA ${producto.iva}%
            </span>

            <button
                type="button"
                class="producto-eliminar"
                onclick="eliminarProducto(${producto.id})"
            >
                Eliminar
            </button>

        `;


        lista.appendChild(elemento);

    });
}
// Elimina un producto del catálogo
function eliminarProducto(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar este producto?"
        );


    if (!confirmar) {
        return;
    }


    productos =
        productos.filter(
            producto =>
                producto.id !== id
        );


    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );


    mostrarProductos();
}

// Inicializamos el programa colocando la fecha actual
colocarFechaActual();
mostrarProductos();






