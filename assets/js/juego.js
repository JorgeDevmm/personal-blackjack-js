/**
 * 2C= two of clubs(trebol)
 * 2D= two of clubs(diamantes)
 * 2H= two of clubs(corazon)
 * 2S= two of clubs(espadas)
 */

let deck = [];
const tipos = ['C', 'D', 'H', 'S'];
const especiales = ['A', 'J', 'Q', 'K'];

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

  cartaObtenida = deck.pop();

  return cartaObtenida;
};

pedirCarta();
