/**
 * 2C= two of clubs(trebol)
 * 2D= two of clubs(diamantes)
 * 2H= two of clubs(corazon)
 * 2S= two of clubs(espadas)
 */

let deck = [];
const tipos = ['C', 'D', 'H', 'S'];
const especiales = ['A', 'J', 'Q', 'K'];

// puntajes
let puntosJugador = 0,
  puntosComputadora = 0;

// Referencia HTML
const jugadorMostrarPuntaje = document.querySelectorAll('small');
const mostrarCartasJugador = document.querySelector('#jugador-cartas');
const mostrarCartasComputador = document.querySelector('#computadora-cartas');

const btnPedir = document.querySelector('#btnPedir');
const btnNuevo = document.querySelector('#btnNuevo');
const btnDetener = document.querySelector('#btnDetener');

const modalElemento = document.querySelector('.modal');
const modalMensaje = document.querySelector('.modal-mensaje');

// Esta función crea una nueva baraja
const crearDeck = () => {
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

  deck = deck.sort(comparacion);
  return deck;
};

// función para utilizar como parametro para numero aleatorios sort
const comparacion = () => {
  return Math.random() - 0.5;
};

crearDeck();

// Función me permite tormar una carta
const pedirCarta = () => {
  if (deck.length === 0) {
    throw `No hay cartas en el deck`;
  }

  // obtenemos la ultima carta y la quitamos del array original
  let ultimaCarta = deck.pop();

  return ultimaCarta;
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

// Turno de la computadora
const turnoComputadora = (puntosMinimos) => {
  do {
    const cartaObtenida = pedirCarta();

    // acumulamos el puntaje variable global
    puntosComputadora += valorCarta(cartaObtenida);

    // mostrar los puntajes acumulador del jugador en pantalla
    jugadorMostrarPuntaje[1].innerText = puntosComputadora;

    // creamos la imagen de la carta
    const imagen = document.createElement('img');
    imagen.classList.add('carta');
    imagen.src = `assets/cartas/${cartaObtenida}.png`;

    mostrarCartasComputador.append(imagen);

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

// Eventos
btnPedir.addEventListener('click', () => {
  const cartaObtenida = pedirCarta();

  // acumulamos el puntaje variable global
  puntosJugador += valorCarta(cartaObtenida);

  // mostrar los puntajes acumulador del jugador en pantalla
  jugadorMostrarPuntaje[0].innerText = puntosJugador;

  // creamos la imagen de la carta
  const imagen = document.createElement('img');

  imagen.src = `assets/cartas/${cartaObtenida}.png`;
  imagen.classList.add('carta');

  mostrarCartasJugador.append(imagen);

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
  console.clear();
  // limpiamos el deck
  deck = [];

  // creamos de nuevo el deck
  deck = crearDeck();

  // activamos los botonos
  btnPedir.disabled = false;
  btnDetener.disabled = false;

  // reseteo puntajes
  puntosComputadora = 0;
  puntosJugador = 0;

  // elimimo puntaje visual
  jugadorMostrarPuntaje[0].innerText = 0;
  jugadorMostrarPuntaje[1].innerText = 0;

  // elimino cartas visual
  mostrarCartasJugador.innerHTML = '';
  mostrarCartasComputador.innerHTML = '';
});

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
