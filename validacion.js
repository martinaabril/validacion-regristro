// Estado inicial
const formulario = document.querySelector("#formRegistro");
const zonaMensaje = document.querySelector("#zonaMensaje");

const entradaNombre = document.querySelector("#nombre");
const entradaEmail = document.querySelector("#email");
const entradaEdad = document.querySelector("#edad");
const entradaFecha = document.querySelector("#fecha");
const entradaTipo = document.querySelector("#tipoEntrada");
const entradaComentarios = document.querySelector("#comentarios");

// Clase de error personalizada
class ErrorFormulario extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = "ErrorFormulario";
    }
}

// Función principal de validación
function validarFormulario(datos) {
    const { nombre, email, edad, fecha, tipoEntrada, comentarios } = datos;

    // Nombre obligatorio
    if (!nombre.trim()) {
        throw new ErrorFormulario("El nombre es obligatorio.");
    }

    // Email válido (básico)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ErrorFormulario("El email no es válido.");
    }

    // Edad válida
    if (!Number.isInteger(edad) || edad < 14 || edad > 99) {
        throw new ErrorFormulario("Edad válida: 14 a 99 años.");
    }

    // Validaciones según tipo de entrada
    if (tipoEntrada === "VIP" && edad < 18) {
        throw new ErrorFormulario("La entrada VIP requiere ser mayor de edad.");
    }

    if (tipoEntrada === "ESTUDIANTE" && edad > 30) {
        throw new ErrorFormulario("La entrada estudiante es solo hasta 30 años.");
    }

    // Fecha no puede ser pasada
    const hoy = new Date();
    hoy.setHours(0,0,0,0); // hoy a medianoche
    const fechaEvento = new Date(fecha);

    if (fechaEvento < hoy) {
        throw new ErrorFormulario("La fecha no puede ser anterior a hoy.");
    }

    // Comentario opcional pero coherente
    if (comentarios && comentarios.trim().length > 0 && comentarios.length < 10) {
        throw new ErrorFormulario("Si escribes comentarios, mínimo 10 caracteres.");
    }
}

// Mostrar mensajes
function mostrarMensaje(texto, tipoClase) {
    zonaMensaje.textContent = texto;
    zonaMensaje.className = `mensaje ${tipoClase}`;
}

// Evento submit
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    try {
        const datosFormulario = {
            nombre: entradaNombre.value,
            email: entradaEmail.value,
            edad: Number(entradaEdad.value),
            fecha: entradaFecha.value,
            tipoEntrada: entradaTipo.value,
            comentarios: entradaComentarios.value
        };

        validarFormulario(datosFormulario);

        mostrarMensaje("✅ Inscripción enviada correctamente.", "correcto");

        formulario.reset();

    } catch (error) {
        if (error instanceof ErrorFormulario) {
            mostrarMensaje(error.message, "aviso");
        } else {
            mostrarMensaje("Error inesperado del sistema.", "error");
            console.error(error);
        }
    }
});