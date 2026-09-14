/* =========================================================
   CONFIGURACIÓN DE SUPABASE
========================================================= */

/*
 * URL de tu proyecto Supabase
 */
const SUPABASE_URL =
    "https://qqvwodojgfnnyrzbmxct.supabase.co";


/*
 * IMPORTANTE:
 *
 * Coloca aquí tu PUBLISHABLE KEY.
 *
 * Debe comenzar aproximadamente así:
 *
 * sb_publishable_...
 *
 * NO coloques aquí la Secret Key.
 */
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ExacqsFv3K7qz1hDV7Imaw_ajvJS8IY";


/*
 * Cliente Supabase
 *
 * Supabase se carga desde el CDN en index.html.
 */
const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/*
 * Nombre del bucket creado en Supabase
 */
const BUCKET_PERSONALIZACIONES =
    "personalizaciones";


/* =========================================================
   DATOS DE LAS APLICACIONES
========================================================= */

const aplicaciones = {

    clinico: {

        nombre: "Sistema Clínico",

        descripcion:
            "Aplicación desarrollada para facilitar la gestión de información clínica.",

        version: "1.0",

        plataforma: "Windows",

        tecnologia: "Python / Tkinter",

        archivo: "ZIP",

        categoria: "Salud",

        icono: "🏥",

        imagen: "imagenes/sistema-clinico.png",

        descarga: "descargas/sistema-clinico.zip",

        documentacion: "documentos/sistema-clinico.pdf",

        video: "videos/sistema-clinico.mp4",

        caracteristicas: [

            "Gestión de información clínica.",

            "Registro y consulta de pacientes.",

            "Interfaz gráfica desarrollada con Tkinter.",

            "Funcionamiento en Windows.",

            "Gestión organizada de información."

        ],

        capturas: [

            "imagenes/clinico-1.png",

            "imagenes/clinico-2.png",

            "imagenes/clinico-3.png"

        ]

    },


    resumidor: {

        nombre: "Resumidor Jurídico",

        descripcion:
            "Aplicación orientada al procesamiento y resumen de información jurídica.",

        version: "1.0",

        plataforma: "Windows",

        tecnologia: "Python",

        archivo: "ZIP",

        categoria: "Derecho",

        icono: "⚖️",

        imagen: "imagenes/resumidor-juridico.png",

        descarga: "descargas/resumidor-juridico.zip",

        documentacion: "documentos/resumidor-juridico.pdf",

        video: "videos/resumidor-juridico.mp4",

        caracteristicas: [

            "Procesamiento de información jurídica.",

            "Generación de resúmenes.",

            "Organización de información.",

            "Interfaz sencilla.",

            "Herramientas orientadas al trabajo jurídico."

        ],

        capturas: [

            "imagenes/resumidor-1.png",

            "imagenes/resumidor-2.png",

            "imagenes/resumidor-3.png"

        ]

    }

};


/* =========================================================
   VARIABLES
========================================================= */

let aplicacionActual = null;

let categoriaActual = "Todas";

let indiceImagenActual = 0;

let capturasActuales = [];

let valoracionActual = 0;


/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const contenedorAplicaciones =
    document.getElementById("contenedor-aplicaciones");

const buscador =
    document.getElementById("buscador-aplicaciones");

const categorias =
    document.querySelectorAll(".categoria");

const modal =
    document.getElementById("ventana-info");

const cerrarModal =
    document.getElementById("cerrar-modal");

const botonDescargar =
    document.getElementById("boton-descargar");

const botonVerAplicaciones =
    document.getElementById("boton-ver-aplicaciones");

const visorImagen =
    document.getElementById("visor-imagen");

const cerrarVisor =
    document.getElementById("cerrar-visor");

const imagenGrande =
    document.getElementById("imagen-grande");

const imagenAnterior =
    document.getElementById("imagen-anterior");

const imagenSiguiente =
    document.getElementById("imagen-siguiente");

const contadorImagen =
    document.getElementById("contador-imagen");


/* =========================================================
   MOSTRAR APLICACIONES
========================================================= */

function mostrarAplicaciones() {

    contenedorAplicaciones.innerHTML = "";

    const textoBusqueda =
        buscador.value.trim().toLowerCase();


    const lista =
        Object.entries(aplicaciones).filter(
            ([id, app]) => {

                const coincideCategoria =
                    categoriaActual === "Todas" ||
                    app.categoria === categoriaActual;

                const coincideBusqueda =
                    app.nombre
                        .toLowerCase()
                        .includes(textoBusqueda) ||

                    app.descripcion
                        .toLowerCase()
                        .includes(textoBusqueda);

                return coincideCategoria && coincideBusqueda;
            }
        );


    const sinResultados =
        document.getElementById("sin-resultados");


    if (lista.length === 0) {

        sinResultados.style.display = "block";

        return;

    }


    sinResultados.style.display = "none";


    lista.forEach(
        ([id, app]) => {

            const tarjeta =
                document.createElement("div");

            tarjeta.className = "tarjeta";


            tarjeta.innerHTML = `

                <div class="icono-aplicacion">
                    ${app.icono}
                </div>

                <h3>
                    ${app.nombre}
                </h3>

                <p>
                    ${app.descripcion}
                </p>

                <p class="version">
                    Versión ${app.version}
                </p>

                <div class="info-tecnica">

                    <span>
                        ${app.categoria}
                    </span>

                    <span>
                        ${app.plataforma}
                    </span>

                    <span>
                        ${app.tecnologia}
                    </span>

                </div>

                <div class="botones">

                    <button
                        type="button"
                        data-accion="ver"
                        data-id="${id}"
                    >
                        Ver más
                    </button>

                    <button
                        type="button"
                        class="boton-descarga"
                        data-accion="descargar"
                        data-id="${id}"
                    >
                        Descargar
                    </button>

                </div>

            `;


            contenedorAplicaciones.appendChild(tarjeta);

        }
    );

}


/* =========================================================
   EVENTOS DE TARJETAS
========================================================= */

contenedorAplicaciones.addEventListener(
    "click",
    function(event) {

        const boton =
            event.target.closest("button");

        if (!boton) {
            return;
        }


        const id =
            boton.dataset.id;

        const accion =
            boton.dataset.accion;


        if (!id) {
            return;
        }


        if (accion === "ver") {

            abrirFicha(id);

        }


        if (accion === "descargar") {

            descargarAplicacion(id);

        }

    }
);


/* =========================================================
   ABRIR FICHA
========================================================= */

function abrirFicha(id) {

    const app =
        aplicaciones[id];

    if (!app) {
        return;
    }


    aplicacionActual = id;


    document.getElementById("icono-info").textContent =
        app.icono;


    document.getElementById("titulo-info").textContent =
        app.nombre;


    const imagen =
        document.getElementById("imagen-info");

    imagen.src =
        app.imagen;

    imagen.alt =
        app.nombre;


    document.getElementById("texto-info").textContent =
        app.descripcion;


    document.getElementById("version-info").textContent =
        app.version;


    document.getElementById("plataforma-info").textContent =
        app.plataforma;


    document.getElementById("tecnologia-info").textContent =
        app.tecnologia;


    document.getElementById("archivo-info").textContent =
        app.archivo;


    cargarCaracteristicas(app);

    cargarDocumentacion(app);

    cargarVideo(app);

    cargarGaleria(app);

    cargarComentarios(id);

    prepararValoracion();


    modal.classList.add("mostrar");

    document.body.style.overflow = "hidden";

}


/* =========================================================
   CARACTERÍSTICAS
========================================================= */

function cargarCaracteristicas(app) {

    const lista =
        document.getElementById("lista-caracteristicas");

    lista.innerHTML = "";


    app.caracteristicas.forEach(
        caracteristica => {

            const li =
                document.createElement("li");

            li.textContent =
                caracteristica;

            lista.appendChild(li);

        }
    );

}


/* =========================================================
   DOCUMENTACIÓN
========================================================= */

function cargarDocumentacion(app) {

    const contenedor =
        document.getElementById("documentacion-info");


    contenedor.innerHTML = "";


    if (!app.documentacion) {

        return;

    }


    const enlace =
        document.createElement("a");

    enlace.href =
        app.documentacion;

    enlace.target =
        "_blank";

    enlace.rel =
        "noopener noreferrer";

    enlace.textContent =
        "📄 Ver documentación PDF";


    contenedor.appendChild(enlace);

}


/* =========================================================
   VIDEO
========================================================= */

function cargarVideo(app) {

    const contenedor =
        document.getElementById("contenedor-video");

    const seccion =
        document.getElementById("seccion-video");


    contenedor.innerHTML = "";


    if (!app.video) {

        seccion.style.display = "none";

        return;

    }


    seccion.style.display = "block";


    const video =
        document.createElement("video");

    video.controls = true;

    video.preload = "metadata";

    video.src =
        app.video;


    contenedor.appendChild(video);

}


/* =========================================================
   GALERÍA
========================================================= */

function cargarGaleria(app) {

    const galeria =
        document.getElementById("galeria-imagenes");


    galeria.innerHTML = "";


    capturasActuales =
        app.capturas || [];


    if (capturasActuales.length === 0) {

        document
            .getElementById("galeria-info")
            .style.display = "none";

        return;

    }


    document
        .getElementById("galeria-info")
        .style.display = "block";


    capturasActuales.forEach(
        (rutaImagen, indice) => {

            const item =
                document.createElement("div");

            item.className =
                "captura-item";


            const img =
                document.createElement("img");

            img.src =
                rutaImagen;

            img.alt =
                `${app.nombre} - captura ${indice + 1}`;


            img.addEventListener(
                "click",
                function() {

                    abrirVisor(indice);

                }
            );


            item.appendChild(img);

            galeria.appendChild(item);

        }
    );

}


/* =========================================================
   VISOR
========================================================= */

function abrirVisor(indice) {

    if (
        capturasActuales.length === 0
    ) {
        return;
    }


    indiceImagenActual =
        indice;


    actualizarVisor();


    visorImagen.classList.add("mostrar");

}


/* =========================================================
   ACTUALIZAR VISOR
========================================================= */

function actualizarVisor() {

    const ruta =
        capturasActuales[indiceImagenActual];


    imagenGrande.src =
        ruta;


    imagenGrande.alt =
        `Captura ${indiceImagenActual + 1}`;


    contadorImagen.textContent =
        `${indiceImagenActual + 1} / ${capturasActuales.length}`;

}


/* =========================================================
   SIGUIENTE
========================================================= */

imagenSiguiente.addEventListener(
    "click",
    function() {

        if (capturasActuales.length === 0) {
            return;
        }


        indiceImagenActual++;


        if (
            indiceImagenActual >=
            capturasActuales.length
        ) {

            indiceImagenActual = 0;

        }


        actualizarVisor();

    }
);


/* =========================================================
   ANTERIOR
========================================================= */

imagenAnterior.addEventListener(
    "click",
    function() {

        if (capturasActuales.length === 0) {
            return;
        }


        indiceImagenActual--;


        if (indiceImagenActual < 0) {

            indiceImagenActual =
                capturasActuales.length - 1;

        }


        actualizarVisor();

    }
);


/* =========================================================
   CERRAR VISOR
========================================================= */

function cerrarVisorImagen() {

    visorImagen.classList.remove("mostrar");

    imagenGrande.src = "";

}


cerrarVisor.addEventListener(
    "click",
    cerrarVisorImagen
);


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarFicha() {

    modal.classList.remove("mostrar");

    document.body.style.overflow = "";


    const video =
        document.querySelector(
            "#contenedor-video video"
        );


    if (video) {

        video.pause();

        video.currentTime = 0;

    }

}


cerrarModal.addEventListener(
    "click",
    cerrarFicha
);


/* =========================================================
   CERRAR HACIENDO CLICK FUERA
========================================================= */

modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modal
        ) {

            cerrarFicha();

        }

    }
);


/* =========================================================
   CERRAR VISOR HACIENDO CLICK FUERA
========================================================= */

visorImagen.addEventListener(
    "click",
    function(event) {

        if (
            event.target === visorImagen
        ) {

            cerrarVisorImagen();

        }

    }
);


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            cerrarVisorImagen();

            cerrarFicha();

        }


        if (
            visorImagen.classList.contains("mostrar")
        ) {

            if (event.key === "ArrowRight") {

                imagenSiguiente.click();

            }


            if (event.key === "ArrowLeft") {

                imagenAnterior.click();

            }

        }

    }
);


/* =========================================================
   DESCARGAR APLICACIÓN
========================================================= */

function descargarAplicacion(id) {

    const app =
        aplicaciones[id];


    if (!app || !app.descarga) {
        return;
    }


    const enlace =
        document.createElement("a");

    enlace.href =
        app.descarga;

    enlace.download = "";

    document.body.appendChild(enlace);

    enlace.click();

    enlace.remove();

}


/* =========================================================
   BOTÓN DESCARGAR DE LA FICHA
========================================================= */

botonDescargar.addEventListener(
    "click",
    function() {

        if (!aplicacionActual) {
            return;
        }


        descargarAplicacion(
            aplicacionActual
        );

    }
);


/* =========================================================
   BOTÓN VER APLICACIONES
========================================================= */

botonVerAplicaciones.addEventListener(
    "click",
    function() {

        document
            .getElementById("aplicaciones")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================================
   BUSCADOR
========================================================= */

buscador.addEventListener(
    "input",
    mostrarAplicaciones
);


/* =========================================================
   CATEGORÍAS
========================================================= */

categorias.forEach(
    boton => {

        boton.addEventListener(
            "click",
            function() {

                categorias.forEach(
                    item => {

                        item.classList.remove(
                            "activa"
                        );

                    }
                );


                boton.classList.add(
                    "activa"
                );


                categoriaActual =
                    boton.dataset.categoria;


                mostrarAplicaciones();

            }
        );

    }
);


/* =========================================================
   ARCHIVO ZIP Y PERSONALIZACIÓN
========================================================= */

const nombrePersonalizacion =
    document.getElementById("nombre-personalizacion");

const correoPersonalizacion =
    document.getElementById("correo-personalizacion");

const aplicacionPersonalizacion =
    document.getElementById("aplicacion-personalizacion");

const descripcionPersonalizacion =
    document.getElementById("descripcion-personalizacion");


const archivoZip =
    document.getElementById("archivo-zip");


const nombreZip =
    document.getElementById("nombre-zip");


const botonSubirZip =
    document.getElementById("boton-subir-zip");


const mensajeArchivo =
    document.getElementById("mensaje-archivo");


/* =========================================================
   MOSTRAR ARCHIVO SELECCIONADO
========================================================= */

archivoZip.addEventListener(
    "change",
    function() {

        if (
            !archivoZip.files ||
            archivoZip.files.length === 0
        ) {

            nombreZip.textContent =
                "Ningún archivo seleccionado";

            return;

        }


        const archivo =
            archivoZip.files[0];


        nombreZip.textContent =
            `Archivo seleccionado: ${archivo.name}`;


        mensajeArchivo.textContent =
            "";

    }
);


/* =========================================================
   SUBIR ZIP A SUPABASE
========================================================= */

async function subirArchivoSupabase(archivo) {

    /*
     * Comprobamos que Supabase esté disponible.
     */

    if (
        !window.supabase ||
        !supabaseClient
    ) {

        throw new Error(
            "No se pudo conectar con el cliente de Supabase."
        );

    }


    /*
     * Generamos un identificador único.
     */

    const fecha =
        new Date()
            .toISOString()
            .replace(/[:.]/g, "-");


    const identificador =
        crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random()
                .toString(36)
                .substring(2);


    /*
     * Limpiamos el nombre original.
     */

    const nombreSeguro =
        archivo.name
            .replace(/[^a-zA-Z0-9._-]/g, "_");


    /*
     * Nombre final del archivo.
     */

    const nombreArchivo =
        `${fecha}_${identificador}_${nombreSeguro}`;


    /*
     * Subimos el ZIP al bucket.
     */

    const resultado =
        await supabaseClient
            .storage
            .from(BUCKET_PERSONALIZACIONES)
            .upload(
                nombreArchivo,
                archivo,
                {
                    cacheControl: "3600",

                    upsert: false,

                    contentType:
                        "application/zip"
                }
            );


    if (resultado.error) {

        throw resultado.error;

    }


    /*
     * Devolvemos la información
     * del archivo guardado.
     */

    return {

        nombreOriginal:
            archivo.name,

        nombreGuardado:
            nombreArchivo,

        ruta:
            resultado.data.path

    };

}


/* =========================================================
   REGISTRAR SOLICITUD EN SUPABASE
========================================================= */

async function registrarSolicitudSupabase(datos) {

    /*
     * Guardamos los datos del formulario
     * en la tabla:
     *
     * solicitudes_personalizacion
     */

    const { error } =
        await supabaseClient
            .from("solicitudes_personalizacion")
            .insert([

                {

                    nombre:
                        datos.nombre,

                    correo:
                        datos.correo,

                    aplicacion:
                        datos.aplicacion,

                    descripcion:
                        datos.descripcion,

                    archivo_zip:
                        datos.archivoZip,

                    estado:
                        "pendiente"

                }

            ]);


    /*
     * Si Supabase devuelve un error,
     * detenemos el proceso.
     */

    if (error) {

        throw error;

    }

}


/* =========================================================
   LIMPIAR FORMULARIO DE PERSONALIZACIÓN
========================================================= */

function limpiarFormularioPersonalizacion() {

    nombrePersonalizacion.value =
        "";

    correoPersonalizacion.value =
        "";

    aplicacionPersonalizacion.value =
        "";

    descripcionPersonalizacion.value =
        "";

    archivoZip.value =
        "";

    nombreZip.textContent =
        "Ningún archivo seleccionado";

}


/* =========================================================
   BOTÓN ENVIAR SOLICITUD
========================================================= */

botonSubirZip.addEventListener(
    "click",
    async function() {

        /*
         * Evitamos múltiples envíos
         * al mismo tiempo.
         */

        if (
            botonSubirZip.dataset.subiendo === "true"
        ) {

            return;

        }


        /* =================================================
           OBTENER DATOS DEL FORMULARIO
        ================================================= */

        const nombre =
            nombrePersonalizacion.value.trim();


        const correo =
            correoPersonalizacion.value.trim();


        const aplicacion =
            aplicacionPersonalizacion.value.trim();


        const descripcion =
            descripcionPersonalizacion.value.trim();


        /* =================================================
           VALIDAR NOMBRE
        ================================================= */

        if (
            nombre.length < 2 ||
            nombre.length > 100
        ) {

            mensajeArchivo.textContent =
                "⚠️ Escribe un nombre válido.";

            nombrePersonalizacion.focus();

            return;

        }


        /* =================================================
           VALIDAR CORREO
        ================================================= */

        if (
            !correoPersonalizacion.checkValidity()
        ) {

            mensajeArchivo.textContent =
                "⚠️ Escribe un correo electrónico válido.";

            correoPersonalizacion.focus();

            return;

        }


        /* =================================================
           VALIDAR APLICACIÓN
        ================================================= */

        if (!aplicacion) {

            mensajeArchivo.textContent =
                "⚠️ Selecciona una aplicación.";

            aplicacionPersonalizacion.focus();

            return;

        }


        /* =================================================
           VALIDAR DESCRIPCIÓN
        ================================================= */

        if (
            descripcion.length < 1 ||
            descripcion.length > 2000
        ) {

            mensajeArchivo.textContent =
                "⚠️ Describe la personalización que necesitas.";

            descripcionPersonalizacion.focus();

            return;

        }


        /* =================================================
           COMPROBAR ARCHIVO
        ================================================= */

        if (
            !archivoZip.files ||
            archivoZip.files.length === 0
        ) {

            mensajeArchivo.textContent =
                "⚠️ Primero selecciona un archivo ZIP.";

            return;

        }


        const archivo =
            archivoZip.files[0];


        /* =================================================
           COMPROBAR EXTENSIÓN
        ================================================= */

        if (
            !archivo.name
                .toLowerCase()
                .endsWith(".zip")
        ) {

            mensajeArchivo.textContent =
                "⚠️ Solo se permiten archivos ZIP.";

            return;

        }


        /* =================================================
           COMPROBAR TAMAÑO
        ================================================= */

        const limite =
            50 * 1024 * 1024;


        if (
            archivo.size > limite
        ) {

            mensajeArchivo.textContent =
                "⚠️ El archivo supera el límite de 50 MB.";

            return;

        }


        /* =================================================
           ACTIVAR ESTADO DE ENVÍO
        ================================================= */

        botonSubirZip.dataset.subiendo =
            "true";


        const textoOriginal =
            botonSubirZip.textContent;


        botonSubirZip.disabled =
            true;


        botonSubirZip.textContent =
            "⏳ Enviando...";


        mensajeArchivo.textContent =
            "⏳ Subiendo archivo y registrando solicitud...";


        try {

            /* =================================================
               1. SUBIR ZIP
            ================================================= */

            const resultado =
                await subirArchivoSupabase(
                    archivo
                );


            console.log(
                "Archivo enviado a Supabase:",
                resultado
            );


            /* =================================================
               2. GUARDAR SOLICITUD EN LA BASE DE DATOS
            ================================================= */

            await registrarSolicitudSupabase({

                nombre:
                    nombre,

                correo:
                    correo,

                aplicacion:
                    aplicacion,

                descripcion:
                    descripcion,

                archivoZip:
                    resultado.ruta

            });


            /* =================================================
               3. MOSTRAR ÉXITO
            ================================================= */

            mensajeArchivo.textContent =
                "✅ Solicitud enviada correctamente. Hemos recibido tus datos y tu archivo ZIP.";


            /* =================================================
               4. LIMPIAR FORMULARIO
            ================================================= */

            limpiarFormularioPersonalizacion();


        } catch (error) {

            console.error(
                "Error al enviar solicitud:",
                error
            );


            /*
             * Mostramos un mensaje general
             * al usuario.
             */

            mensajeArchivo.textContent =
                "❌ No se pudo enviar la solicitud. Inténtalo nuevamente.";

        } finally {

            /*
             * Restauramos el botón.
             */

            botonSubirZip.dataset.subiendo =
                "false";


            botonSubirZip.disabled =
                false;


            botonSubirZip.textContent =
                textoOriginal;

        }

    }
);
/* =========================================================
   COMENTARIOS
========================================================= */

const formularioComentario =
    document.getElementById(
        "formulario-comentario"
    );


const nombreComentario =
    document.getElementById(
        "nombre-comentario"
    );


const textoComentario =
    document.getElementById(
        "texto-comentario"
    );


const estrellas =
    document.querySelectorAll(
        "#estrellas-valoracion button"
    );


/* =========================================================
   SELECCIÓN DE ESTRELLAS
========================================================= */

estrellas.forEach(
    estrella => {

        estrella.addEventListener(
            "click",
            function() {

                valoracionActual =
                    Number(
                        estrella.dataset.valor
                    );


                actualizarEstrellas();

            }
        );

    }
);


/* =========================================================
   ACTUALIZAR ESTRELLAS
========================================================= */

function actualizarEstrellas() {

    estrellas.forEach(
        estrella => {

            const valor =
                Number(
                    estrella.dataset.valor
                );


            estrella.classList.toggle(
                "seleccionada",
                valor <= valoracionActual
            );

        }
    );

}


/* =========================================================
   PREPARAR VALORACIÓN
========================================================= */

function prepararValoracion() {

    valoracionActual = 0;

    actualizarEstrellas();

    nombreComentario.value = "";

    textoComentario.value = "";

}


/* =========================================================
   CLAVE DE COMENTARIOS
========================================================= */

function obtenerClaveComentarios(id) {

    return `comentarios_${id}`;

}


/* =========================================================
   OBTENER COMENTARIOS
========================================================= */

function obtenerComentarios(id) {

    const datos =
        localStorage.getItem(
            obtenerClaveComentarios(id)
        );


    if (!datos) {

        return [];

    }


    try {

        return JSON.parse(datos);

    } catch (error) {

        return [];

    }

}


/* =========================================================
   GUARDAR COMENTARIOS
========================================================= */

function guardarComentarios(
    id,
    comentarios
) {

    localStorage.setItem(
        obtenerClaveComentarios(id),
        JSON.stringify(comentarios)
    );

}


/* =========================================================
   CARGAR COMENTARIOS
========================================================= */

function cargarComentarios(id) {

    const contenedor =
        document.getElementById(
            "comentarios-lista"
        );


    contenedor.innerHTML = "";


    const comentarios =
        obtenerComentarios(id);


    if (comentarios.length === 0) {

        contenedor.innerHTML =
            "<p>No hay comentarios todavía.</p>";

        return;

    }


    comentarios
        .slice()
        .reverse()
        .forEach(
            comentario => {

                const elemento =
                    document.createElement("div");

                elemento.className =
                    "comentario";


                const estrellasTexto =
                    "★".repeat(
                        comentario.valoracion
                    ) +
                    "☆".repeat(
                        5 - comentario.valoracion
                    );


                elemento.innerHTML = `

                    <div class="comentario-cabecera">

                        <span class="comentario-nombre">
                            ${escapeHTML(comentario.nombre)}
                        </span>

                        <span class="comentario-estrellas">
                            ${estrellasTexto}
                        </span>

                    </div>

                    <p class="comentario-texto">
                        ${escapeHTML(comentario.texto)}
                    </p>

                `;


                contenedor.appendChild(
                    elemento
                );

            }
        );

}


/* =========================================================
   PUBLICAR COMENTARIO
========================================================= */

formularioComentario.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        if (!aplicacionActual) {

            return;

        }


        const nombre =
            nombreComentario.value.trim();


        const texto =
            textoComentario.value.trim();


        if (!nombre || !texto) {

            return;

        }


        if (valoracionActual < 1) {

            alert(
                "Selecciona una valoración de 1 a 5 estrellas."
            );

            return;

        }


        const comentarios =
            obtenerComentarios(
                aplicacionActual
            );


        comentarios.push({

            nombre: nombre,

            texto: texto,

            valoracion: valoracionActual,

            fecha: new Date().toISOString()

        });


        guardarComentarios(
            aplicacionActual,
            comentarios
        );


        cargarComentarios(
            aplicacionActual
        );


        prepararValoracion();

    }
);


/* =========================================================
   SEGURIDAD DEL TEXTO DE COMENTARIOS
========================================================= */

function escapeHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto;

    return div.innerHTML;

}


/* =========================================================
   INICIAR PÁGINA
========================================================= */

mostrarAplicaciones();
