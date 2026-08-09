
let contadorProductos = 0;
let contadorFacturas = 1;

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
            <input
                type="text"
                class="descripcion"
                placeholder="Producto"
            >
        </td>

        <td>
            <input
                type="number"
                class="precio"
                value="0"
                min="0"
                step="0.01"
            >
        </td>

        <td>
            <select class="iva">

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
function agregarEventosFila(fila) {

    const cantidad =
        fila.querySelector(".cantidad");

    const precio =
        fila.querySelector(".precio");

    const iva =
        fila.querySelector(".iva");


    cantidad.addEventListener(
        "input",
        calcularTotales
    );

    precio.addEventListener(
        "input",
        calcularTotales
    );

    iva.addEventListener(
        "change",
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



