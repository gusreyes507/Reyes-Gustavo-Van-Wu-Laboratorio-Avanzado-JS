{
    //Seleccionar elementos

    const form = document.querySelector('#inscripcion');

    const nombre = document.querySelector('#nombre');
    const cedula = document.querySelector('#cedula');
    const correo = document.querySelector('#correo');
    const celular = document.querySelector('#celular');
    const fechaNacimiento = document.querySelector('#fechaNacimiento');
    const curso = document.querySelector('#curso');

    const modalidad = document.querySelectorAll('input[name="modalidad"]');
    const sede = document.querySelector('#sede');
    const campoSede = document.querySelector('#campo-sede');

    const clave = document.querySelector('#clave');
    const clave2 = document.querySelector('#clave2');

    const comentarios = document.querySelector('#comentarios');
    const contador = document.querySelector('#comentarios-contador');

    const terminos = document.querySelector('#terminos');

    const confirmacion = document.querySelector('#confirmacion');


    //Reglas de validación

    const reglas = {
        nombre: v => (
            v.trim().length >= 5 &&
            v.trim().length <= 60 &&
            /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(v) &&
            v.trim().split(/\s+/).length >= 2
        ) || 'Escribe tu nombre completo.',

        cedula: v => /^([1-9]|1[0-3]|PE|E|N)-\d{1,4}-\d{1,6}$/.test(v) || 'Formato: 8-123-4567.',

        correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Usa un correo como nombre@dominio.com.',

        celular: v => /^6\d{3}-?\d{4}$/.test(v) || 'Debe tener 8 dígitos y comenzar con 6.',

        fechaNacimiento: v => {
            if (v === '') return 'Selecciona tu fecha de nacimiento.';
            const fecha = new Date(v);
            const limite = new Date();
            if (fecha > limite) {
                return 'La fecha ingresada no es válida'
            }
            limite.setFullYear(limite.getFullYear() - 16);
            return fecha <= limite || 'Debes tener al menos 16 años.';
        },

        curso: v => v !== '' || 'Selecciona un curso.',

        clave: v => (
            v.length >= 8 &&
            /[A-Z]/.test(v) &&
            /[a-z]/.test(v) &&
            /\d/.test(v) &&
            /[^A-Za-z0-9]/.test(v)
        ) || 'Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.',

        clave2: v => v === clave.value || 'Las contraseñas no coinciden.',
    };


    //Validar campos

    function validarCampo(input) {

        const resultado = reglas[input.name](input.value);
        const valido = resultado === true;
        const error = document.querySelector('#' + input.name + '-error');

        input.setAttribute('aria-invalid', String(!valido));

        error.textContent = valido ? '' : resultado;

        return valido;
    }


    //Validación al salir y mientras se escribe

    const tocados = new Set();

    form.addEventListener('blur', (e) => {

        if (!reglas[e.target.name]) return;

        tocados.add(e.target.name);

        validarCampo(e.target);

    }, true);


    form.addEventListener('input', (e) => {

        if (tocados.has(e.target.name)) {
            validarCampo(e.target);
        }

    });


    //Enviar formulario

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        const campos = [
            nombre,
            cedula,
            correo,
            celular,
            fechaNacimiento,
            curso,
            clave,
            clave2
        ];

        const invalidos = campos.filter(campo => !validarCampo(campo));

        //Validar modalidad
        let modalidadSeleccionada = '';
        for (const opcion of modalidad) {
            if (opcion.checked) {
                modalidadSeleccionada = opcion.value;
            }
        }
        const errorModalidad =
            document.querySelector('#modalidad-error');
        if (modalidadSeleccionada === '') {
            errorModalidad.textContent =
                'Selecciona una modalidad.';
            invalidos.push(modalidad[0]);
        } else {
            errorModalidad.textContent = '';
        }

        //Validar sede
        if (modalidadSeleccionada === 'presencial') {
            const errorSede =
                document.querySelector('#sede-error');
            if (sede.value === '') {
                errorSede.textContent =
                    'Selecciona una sede.';
                sede.setAttribute('aria-invalid', 'true');
                invalidos.push(sede);
            } else {
                errorSede.textContent = '';
                sede.setAttribute('aria-invalid', 'false');
            }
        }


        //Validar términos
        const errorTerminos =
            document.querySelector('#terminos-error');
        if (!terminos.checked) {
            errorTerminos.textContent =
                'Debes aceptar los términos y condiciones.';
            invalidos.push(terminos);
        } else {
            errorTerminos.textContent = '';
        }


        //Mostrar primer error
        if (invalidos.length) {
            invalidos[0].focus();
            return;
        }


        //Crear tarjeta de confirmación
        const tarjeta =
            document.createElement('div');

        tarjeta.classList.add('tarjeta-confirmacion');

        const titulo =
            document.createElement('h2');

        titulo.textContent =
            '¡Inscripción realizada!';

        const textoNombre =
            document.createElement('p');

        textoNombre.textContent =
            'Nombre: ' + nombre.value;

        const textoCedula =
            document.createElement('p');

        textoCedula.textContent =
            'Cédula: ' + cedula.value;

        const textoCorreo =
            document.createElement('p');
        textoCorreo.textContent =
            'Correo: ' + correo.value;

        const textoCelular =
            document.createElement('p');
        textoCelular.textContent =
            'Celular: ' + celular.value;

        const textoCurso =
            document.createElement('p');
        textoCurso.textContent =
            'Curso: ' +
            curso.options[curso.selectedIndex].text;

        const textoModalidad =
            document.createElement('p');
        if (modalidadSeleccionada === 'presencial') {
            textoModalidad.textContent =
                'Modalidad: Presencial';

        } else {
            textoModalidad.textContent =
                'Modalidad: Virtual';
        }

        tarjeta.append(titulo);
        tarjeta.append(textoNombre);
        tarjeta.append(textoCedula);
        tarjeta.append(textoCorreo);
        tarjeta.append(textoCelular);
        tarjeta.append(textoCurso);
        tarjeta.append(textoModalidad);
        if (modalidadSeleccionada === 'presencial') {
            const textoSede =
                document.createElement('p');
            textoSede.textContent =
                'Sede: ' +
                sede.options[sede.selectedIndex].text;
            tarjeta.append(textoSede);
        }
        confirmacion.textContent = '';
        confirmacion.append(tarjeta);

        //Limpiar formulario
        form.reset();
        campoSede.hidden = true;
        contador.textContent = '0 / 200';
        document.querySelector('#clave-fuerza').textContent =
            'Fuerza: —';
    });
}


{
    //Mostrar y ocultar sede
    const modalidad =
        document.querySelectorAll('input[name="modalidad"]');
    const campoSede =
        document.querySelector('#campo-sede');
    const sede =
        document.querySelector('#sede');
    modalidad.forEach(opcion => {
        opcion.addEventListener('change', () => {
            if (opcion.value === 'presencial' &&
                opcion.checked) {
                campoSede.hidden = false;
            }
            if (opcion.value === 'virtual' &&
                opcion.checked) {
                campoSede.hidden = true;
                sede.value = '';
                const error =
                    document.querySelector('#sede-error');
                error.textContent = '';
            }
        });
    });
}

{
    //Fuerza de la contraseña
    const clave =
        document.querySelector('#clave');
    const fuerza =
        document.querySelector('#clave-fuerza');
    clave.addEventListener('input', () => {
        let puntos = 0;
        if (clave.value.length >= 8) {
            puntos++;
        }
        if (/[A-Z]/.test(clave.value)) {
            puntos++;
        }
        if (/[a-z]/.test(clave.value)) {
            puntos++;
        }
        if (/\d/.test(clave.value)) {
            puntos++;
        }
        if (/[^A-Za-z0-9]/.test(clave.value)) {
            puntos++;
        }
        if (puntos <= 2) {
            fuerza.textContent = 'Fuerza: Débil';
        } else if (puntos <= 4) {
            fuerza.textContent = 'Fuerza: Media';
        } else {
            fuerza.textContent = 'Fuerza: Fuerte';
        }
    });
}


{
    //Contador de comentarios
    const comentarios =
        document.querySelector('#comentarios');
    const contador =
        document.querySelector('#comentarios-contador');
    comentarios.addEventListener('input', () => {
        contador.textContent =
            comentarios.value.length + ' / 200';
        if (comentarios.value.length > 180) {
            contador.style.color = 'red';
        } else {
            contador.style.color = '';
        }
    });
}

{
    //Términos y condiciones
    const terminos =
        document.querySelector('#terminos');
    terminos.addEventListener('change', () => {
        const error =
            document.querySelector('#terminos-error');
        if (terminos.checked) {
            error.textContent = '';
        } else {
            error.textContent =
                'Debes aceptar los términos y condiciones.';
        }
    });
}