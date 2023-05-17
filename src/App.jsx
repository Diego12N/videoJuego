import {useEffect, useState} from "react";
import confetti from "canvas-confetti";
import Square from "./components/Square";
import {TURNS} from "./constants";
import {checkWinner, checkEndGame} from "./ligic/board";
import "./App.css";
import {WinnerModal} from "./components/WinnerModal.jsx";

function App() {
	const [board, setBoard] = useState(() => {
		const boardFromStorage = window.localStorage.getItem("board");
		return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
	});
	//const [board, setBoard] = useState(Array(9).fill(null)); // IMPORTANTE: El estado es asincrono por lo que no bloquea la ejecucion del siguiente codigo
	/* Array(9).fill(null); crea un nuevo array con una longitud de 9 elementos y los inicializa con el valor null. */

	useEffect(() => {
		// Cuando no asigno una dependencia, el hook se ejecuta cada vez que se renderiza el componente // si coloco un array vacio, solo se ejecuta en la primera renderizacion.
		console.log("useEffect");
	}, []);

	const [turn, setTurn] = useState(() => {
		const turnFromStorage = window.localStorage.getItem("turn");
		return turnFromStorage ?? TURNS.X;
	});
	const [winner, setWinner] = useState(null);

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setTurn(TURNS.X);
		setWinner(null);

		window.localStorage.removeItem("board");
		window.localStorage.removeItem("turn");
	};

	const updateBoard = (index) => {
		if (board[index] || winner) return; // Esta linea evita que se pueda marcar un casillero que ya esta ocupado o que se continue la partida si hay un ganador

		const newBoard = [...board];
		newBoard[index] = turn;
		setBoard(newBoard);
		console.log(turn);

		//Cambiar el turno
		const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X; // Si el turno Actual es de las X el siguiente turno es el de la O
		setTurn(newTurn);
		console.log(turn, "Set");

		//Guardar partida
		window.localStorage.setItem("board", JSON.stringify(newBoard));
		window.localStorage.setItem("turn", newTurn);

		const newWinner = checkWinner(newBoard); // IMPORTANTE: El estado es asincrono por lo que no bloquea la ejecucion del siguiente codigo, por ello no se recomienda parar como parametro el estado.

		if (newWinner) {
			confetti();
			setWinner(newWinner);
		} else if (checkEndGame(newBoard)) {
			setWinner(false);
		}
	};

	return (
		<main className="board">
			<h1>Tic Tac Toc</h1>
			<button onClick={resetGame}>Reset del juego</button>
			<section className="game">
				{board.map((_, index) => {
					return (
						<Square key={index} index={index} updateBoard={updateBoard}>
							{board[index]}
						</Square>
					);
				})}
			</section>
			<section className="turn">
				<Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
				<Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
			</section>
			<WinnerModal resetGame={resetGame} winner={winner} />
		</main>
	);
}

export default App;
