
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
