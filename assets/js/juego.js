// Patrón módulo
const miJuego = (() => {
  ('use strict');
  /**
   * 2C= two of clubs(trebol)
   * 2D= two of diamonds(diamantes)
   * 2H= two of heart(corazon)
   * 2S= two of swords(espadas)
   */

  // TODO Variables

  let deck = [];
  const tipos = ['C', 'D', 'H', 'S'];
  const especiales = ['A', 'J', 'Q', 'K'];

  // puntajes
  let puntosJugadores = [];

  // TODO  Referencia HTML

  const puntosHTML = document.querySelectorAll('small');
  const divCartasJugadores = document.querySelectorAll('.divCartas');

  const btnPedir = document.querySelector('#btnPedir');
  const btnNuevo = document.querySelector('#btnNuevo');
  const btnDetener = document.querySelector('#btnDetener');

  const modalElemento = document.querySelector('.modal');
  const modalMensaje = document.querySelector('.modal-mensaje');

  // TODO FUNCIONES

  // Esta función inicializa el juego
  const inicializarJuego = (numeroJugadores = 1) => {
    deck = crearDeck();

    // Asegúrate de limpiar los puntosJugadores solo al inicio del juego
    puntosJugadores = [];

    // inicializamos nuestros jugadores
    for (let i = 0; i < numeroJugadores; i++) {
      puntosJugadores.push(0);
    }

    // activamos los botonos
    btnPedir.disabled = false;
    btnDetener.disabled = false;

    // reseteo puntajes de posiciones de jugadores
    puntosJugadores[0] = 0;
    puntosJugadores[1] = 0;

    // elimimo puntaje visual de cada elemento del html
    puntosHTML.forEach((elem) => (elem.innerText = 0));

    // elimino cartas visual de cada elemento del html
    divCartasJugadores.forEach((elem) => (elem.innerText = ''));
  };

  // Esta función crea una nueva baraja
  const crearDeck = () => {
    deck = [];
    // llena al deck cartas+tipo
    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }

    // llena al deck cartas especial+tipo
    for (let especial of especiales) {
      for (let tipo of tipos) {
        deck.push(especial + tipo);
      }
    }

    return deck.sort(comparacion);
  };

  // función para utilizar como parametro para numero aleatorios sort
  const comparacion = () => {
    return Math.random() - 0.5;
  };

  // Función me permite tormar una carta
  const pedirCarta = () => {
    if (deck.length === 0) {
      throw `No hay cartas en el deck`;
    }

    // obtenemos la ultima carta y la quitamos del array original
    return deck.pop();
  };

  // función valor carta, pasando la carta obtenida
  const valorCarta = (carta) => {
    // obteneos el el primer hasta la ultima posición menos uno para 10D
    const valor = carta.substring(0, carta.length - 1);

    // ejecución resumida
    return isNaN(valor)
      ? // cuando sea letra podremos condicionarlo el puntaje
        valor == 'A'
        ? 11
        : 10
      : // para convertir la variable tipo string en número
        valor * 1;
  };

  // acumulación puntos de jugador o computadora,Turno 0 = jugador, ultimo computadora
  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] += valorCarta(carta);
    // mostrar los puntajes acumulador del jugador en pantalla
    puntosHTML[turno].innerText = puntosJugadores[turno];

    return puntosJugadores[turno];
  };

  // Crear la carta en el html
  const crearCarta = (carta, turno) => {
    // creamos la imagen de la carta,ruta,clase y agregamos al div contenedor
    const imagen = document.createElement('img');
    imagen.src = `assets/cartas/${carta}.png`;
    imagen.classList.add('carta');
    divCartasJugadores[turno].append(imagen);
  };

  // Función para definir mostrando un modal quien gana, empata, o pierde
  const determinarGanador = () => {
    const [puntosMinimos, puntosComputadora] = puntosJugadores;

    setTimeout(() => {
      if (puntosMinimos === puntosComputadora) {
        mostrarModal('EMPATE!!');
      } else if (
        (puntosMinimos > puntosComputadora && puntosMinimos <= 21) ||
        puntosComputadora > 21
      ) {
        mostrarModal('GANA JUGADOR');
      } else if (
        (puntosMinimos < puntosComputadora && puntosComputadora <= 21) ||
        puntosMinimos > 21
      ) {
        mostrarModal('GANA COMPUTADORA');
        // alert('GANA COMPUTADORA!!!');
      }
    }, 1000);
  };

  // Turno de la computadora
  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;

    do {
      const cartaObtenida = pedirCarta();
      puntosComputadora = acumularPuntos(
        cartaObtenida,
        puntosJugadores.length - 1
      );
      crearCarta(cartaObtenida, puntosJugadores.length - 1);

      // condiciamos para que no exceda a 21 y que sea menor que el jugador
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    determinarGanador();
  };

  // función mensaje y mostrar modal
  const mostrarModal = (mensaje) => {
    // quitar lo oculto del modal
    modalElemento.classList.remove('d-none');
    modalElemento.removeAttribute('aria-hidden');

    modalMensaje.innerText = mensaje;

    // mostrar modal
    const modal = new bootstrap.Modal(modalElemento);
    modal.show();
  };

  // activar botono y desactivar de acuerdo a la acción
  const gestionarBontonesActivos = () => {
    if (puntosJugadores[0] > 21) {
      btnPedir.disabled = true;
      btnDetener.disabled = true;

      turnoComputadora(puntosJugadores[0]);
    } else if (puntosJugadores[0] === 21) {
      btnPedir.disabled = true;
      btnDetener.disabled = true;

      turnoComputadora(puntosJugadores[0]);
    }
  };

  //TODO Eventos
  btnPedir.addEventListener('click', () => {
    const cartaObtenida = pedirCarta();
    const puntosJugador = acumularPuntos(cartaObtenida, 0);

    crearCarta(cartaObtenida, 0);
    gestionarBontonesActivos();
  });

  // evento detener
  btnDetener.addEventListener('click', () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;

    // inicia la acción del turno de computadora, tras detener
    turnoComputadora(puntosJugadores[0]);
  });

  // evento nuevo juego
  btnNuevo.addEventListener('click', () => {
    // console.clear();

    inicializarJuego();
  });

  return `Empezando el juego`;
})();
