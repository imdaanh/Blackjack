const miModulo= (() => {
    'use strict'

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    // let puntosJugador = 0,
    //     puntosComputadora = 0;

    let puntosJugadores = [];

    //Referencias del HTML

    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small');


    // Esta funcion inicializa el juego 
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();

        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        btnDetener.disabled = false;
        btnPedir.disabled = false;
        

    }

    // Esta funcion crea un nuevo deck
    const crearDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo)
            }
        }

        return _.shuffle(deck);
    }

    //Esta funcion me permite tomar una carta 

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        const posicion = Math.trunc(Math.random() * (deck.length));
        const carta = deck[posicion];
        deck.splice(posicion, 1)
        return carta;
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        if (isNaN(valor)) {
            return (valor === 'A') ? 11 : 10;
        }
        return valor * 1
    }


    // Turno: 0 = primer jugador y el ultimo sera la computadora 
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno]
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('cartas');
        divCartasJugadores[turno].append(imgCarta);

    }

    const determinarGanador =  () => {

        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;

        setTimeout(() => {

            if (puntosComputadora === puntosMinimos) {
                alert('No one won');
            } else if (puntosMinimos > 21) {
                alert('Computer wins')
            } else if (puntosComputadora > 21) {
                alert('Player wins');
            }
            else if (puntosComputadora > puntosJugadores ) {
                alert('Computer wins')
            } else {
                alert('Player wins')
            }
        }, 150);
    }

    // turno de la computadora 

    const turnoComputadora = (puntosMinimos) => {

        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
        
    }


    //Eventos

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);


        crearCarta(carta, 0);


        if (puntosJugador > 21) {
            console.warn('You lose')
            btnPedir.disabled = true;
            btnDetener.disabled = true
            turnoComputadora(puntosJugador);

        } else if (puntosJugador === 21) {
            console.warn('You win!!!!');
            btnPedir.disabled = true;
            btnDetener.disabled = true
        }

    });

    btnDetener.addEventListener('click', () => {

        btnPedir.disabled = true
        btnDetener.disabled = true

        turnoComputadora( puntosJugadores [0] );

    });

    // btnNuevo.addEventListener('click', () => {

    //     inicializarJuego();
    // });

    return {
       nuevoJuego:  inicializarJuego
    };

})();