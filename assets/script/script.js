const items = document.getElementsByClassName('grid-item');
const itemsArray = Array.from(items);

const EMPLACEMENT = [
	"", "", "",
	"", "", "",
	"", "", ""
];

const GAMERS = {
	x: {
		mark: "X",
		score: 0
	},
	o: {
		mark: "0",
		score: 0
	}
};

const winningConditionIdx = [
	//les lignes
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	//Les colonnes
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	//Le diagonal
	[0, 4, 8],
	[2, 4, 6]
]

let turn = GAMERS.x.mark;

/**
 * Le gamers est X, le tour est donc O, dans le cas contraire le tour est X.
 * @param currentPLayer - Le gamers actuel.
 */
function switchTurn(currentPLayer) {
	if (currentPLayer === GAMERS.x.mark) {
		turn = GAMERS.o.mark;
	} else {
		turn = GAMERS.x.mark
	}
}

/**
 * Il renvoie l'index de la cellule actuelle dans le tableau des éléments
 * @param currentCell - La cellule actuelle sur laquelle se trouve l'utilisateur.
 * @returns Index de la cellule actuelle dans le tableau des éléments.
 */
function getCurrentItemsIndex(currentCell) {
	return itemsArray.indexOf(currentCell);
}

/**
 * Il prend un identifiant comme paramètre, puis il change le contenu du texte de la cellule avec cet identifiant en X ou
 * en O, selon le tour actuel
 * @param id - l'identifiant de la cellule sur laquelle on a cliqué
 */
function chooseCase(id) {
	const haveWinner = hasWinner();
	
	const currentCell = document.getElementById(id);
	const currentItemIdx = getCurrentItemsIndex(currentCell);
	if (gameBoard[currentItemIdx] !== '' && !haveWinner) {
		return;
	}
	
	if (turn === GAMERS.x.mark && !haveWinner) {
		currentCell.textContent = GAMERS.x.mark;
		updateGameBoard(currentItemIdx, GAMERS.x.mark);
		setTimeout(cpuTurn, 400); // attendre 4s00ms avant de lancer l'ordinateur
	} else if (turn === GAMERS.o.mark && !haveWinner) {
		currentCell.textContent = GAMERS.o.mark;
		updateGameBoard(currentItemIdx, GAMERS.o.mark);
		switchTurn(turn);
	}
	
	if (haveWinner) {
		const winner = getWinner();
		showWinner(winner);
		outputScore();
		reset();
	}
	resetIfNoOneWin();
}

/**
 * S'il n'y a pas de cellule vide, renvoie false.
 * @returns une valeur booléenne.
 */
function hasEmptyCell() {
	let hasEmptyCell = true;
	if (!(itemsArray.some(element => element.textContent === ""))) {
		hasEmptyCell = false;
	}
	return hasEmptyCell;
}

/**
 * Il renvoie un index aléatoire du tableau EMPLACEMENT qui est vide
 * @returns Index d'une cellule vide aléatoire.
 */
function getFreeCell() {
	let randomIdx = 0;
	do {
		randomIdx = Math.floor(Math.random() * EMPLACEMENT.length);
	} while (EMPLACEMENT[randomIdx] !== "" && hasEmptyCell())
	
	return randomIdx;
}

/**
 * Récupère l'identifiant de l'élément que l'ordinateur a choisi.
 * @returns L'identifiant de la cellule libre.
 */
function getCpuChosenElementId() {
	let freeCell = getFreeCell();
	return itemsArray[freeCell].id;
	
}

/**
 * La fonction `cpuTurn()` est appelée lorsque c'est au tour de l'ordinateur de jouer. Il appelle la fonction
 * `switchTurn()` pour changer le virage en tour de l'ordinateur, puis il appelle la fonction `getCpuChosenElementId()`
 * pour obtenir l'identifiant de l'élément sur lequel l'ordinateur cliquera
 */
function cpuTurn() {
	switchTurn(turn);
	const chosenElement = getCpuChosenElementId()
	document.getElementById(chosenElement).click();
}

/**
 * Mettez à jour le tableau EMPLACEMENT à l'index spécifié par le paramètre idx avec le contenu spécifié par le paramètre
 * content.
 * @param idx - L'index du tableau gameBoard que vous souhaitez mettre à jour.
 * @param content - Le contenu de la cellule.
 */
function updateEMPLACEMENT(idx, content) {
	EMPLACEMENT[idx] = content;
}

/**
 * Si les trois éléments dans une condition gagnante sont identiques et non vides, alors il y a un gagnant
 * @returns Une valeur booléenne.
 */
function hasWinner() {
	let hasWinner = false;
	for (const conditions of winningConditionIdx) {
		const a = EMPLACEMENT[conditions[0]];
		const b = EMPLACEMEN[conditions[1]];
		const c = EMPLACEMEN[conditions[2]];
		
		if (a === '' || b === '' || c === '') {
			continue;
		}
		
		if (a === b && b === c) {
			hasWinner = true;
		}
	}
	return hasWinner;
}

/**
 * Si le tour en cours est O, alors le gagnant est X, et vice versa
 * @returns Le gagnant est renvoyé.
 */
function getWinner() {
	let winner = "";
	if (turn === GAMERS.o.mark) {
		winner = GAMERS.x.mark
	} else if (turn === GAMERS.x.mark) {
		winner = GAMERS.o.mark
	}
	return winner;
}

/**
 * Il prend un gagnant comme argument et affiche un message d'alerte basé sur le gagnant
 * @param winner - Le gagnant du jeu.
 */
function showWinner(winner) {
	if (winner === GAMERS.x.mark) {
		alert("TU AS GAGNER");
	} else if (winner === GAMERS.o.mark) {
		alert("TU AS GAGNER")
	}
	setScore(winner);
}

/**
 * Il prend un gagnant et incrémente le score du joueur qui a gagné
 * @param winner - le gagnant du jeu
 */
function setScore(winner) {
	if (winner === GAMERS.x.mark) {
		GAMERS.x.score++
	} else {
		GAMERS.o.score++
	}
}

/**
 * Il obtient les éléments avec les identifiants "player-score" et "cpu-score", et définit leur contenu textuel sur les
 * scores des joueurs
 */
function outputScore() {
	const playerScoreOutput = document.getElementById("player-score");
	const cpuScoreOutput = document.getElementById("cpu-score");
	
	playerScoreOutput.textContent = GAMERS.x.score;
	cpuScoreOutput.textContent = GAMERS.o.score;
}

/**
 * Il réinitialise le plateau de jeu et le contenu textuel des éléments du itemsArray
 */
function reset() {
	for (const item of itemsArray) {
		item.textContent = '';
	}
	
	for (let i = 0; i < gameBoard.length ; i++) {
		gameBoard[i] = "";
	}
	
	if (getWinner() === GAMERS.x.mark) {
		switchTurn(turn);
	}
}

/**
 * S'il n'y a pas de gagnant et qu'il n'y a pas de cellule vide, réinitialisez le jeu
 */
function resetIfNoOneWin() {
	if (!hasWinner() && !hasEmptyCell()) {
		const resetConfirmation = confirm("oN RECOMMENCE DE JOUER?")
		reset();
	}
}