// Patrón módulo
(() => {
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

  // Turno de la computadora
  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;

    console.log({ puntosJugadores });
    do {
      const cartaObtenida = pedirCarta();

      puntosComputadora = acumularPuntos(
        cartaObtenida,
        puntosJugadores.length - 1
      );

      crearCarta(cartaObtenida, puntosJugadores.length - 1);

      // validamos que si puntos minimos es mayor a 21, la computadora gana y solo necesita hacer una vuelta
      if (puntosMinimos > 21) {
        break;
      }

      // condiciamos para que no exceda a 21 y que sea menor que el jugador
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    setTimeout(() => {
      // const modalElemento = document.querySelector('.modal');

      // document.body.append(modalElemento);

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

  //TODO Eventos
  btnPedir.addEventListener('click', () => {
    const cartaObtenida = pedirCarta();
    const puntosJugador = acumularPuntos(cartaObtenida, 0);

    crearCarta(cartaObtenida, 0);

    if (puntosJugador > 21) {
      btnPedir.disabled = true;
      btnDetener.disabled = true;

      turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
      btnPedir.disabled = true;
      btnDetener.disabled = true;

      turnoComputadora(puntosJugador);
    }
  });

  // evento detener
  btnDetener.addEventListener('click', () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;

    turnoComputadora(puntosJugador);
  });

  // evento nuevo juego
  btnNuevo.addEventListener('click', () => {
    // console.clear();

    inicializarJuego();

    // // limpiamos el deck
    // deck = [];

    // // creamos de nuevo el deck
    // deck = crearDeck();

    // activamos los botonos
    btnPedir.disabled = false;
    btnDetener.disabled = false;

    // reseteo puntajes de posiciones de jugadores
    puntosJugadores[0] = 0;
    puntosJugadores[1] = 0;

    // elimimo puntaje visual del html
    puntosHTML[0].innerText = 0;
    puntosHTML[1].innerText = 0;

    // elimino cartas visual dle html
    divCartasJugadores[0].innerHTML = '';
    divCartasJugadores[1].innerHTML = '';
  });
})();
