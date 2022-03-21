/**************************
 * 
 * 
 *  GENERAL VARIABLES: HTML ELEMENT - "GAME" AND "PLAYERS" STATE 
 * 
 * 
************************/
const player = {
    currently: "X",
    winner: null,
    name: {
        first: null,
        second: null
    }
}
const game = {
    active: true,
    status: ["", "", "", "", "", "", "", "", ""],
    statusMessage: null,
    cells: ["top-left", "top-center", "top-right", "middle-left", "middle-center", "middle-right", "botton-left", "botton-center", "botton-right"],
    winningPlays: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
}

let boxGame = document.querySelector(".box-game"),
    currentPlayer = document.querySelector("#player"),
    statusDisplay = document.querySelector("#statusDisplay");

/**************************
 * 
 * 
 * CODE: GAME RULE
 * 
 * 
************************/
document.addEventListener("DOMContentLoaded", gameStart);

function gameStart() {
    getPlayerData();
    addControlCell();
    handleGameStateUpdate();
    let cellElement = document.querySelectorAll(".control-cell");

    cellElement.forEach(currentCell => {
        currentCell.addEventListener("click", () => {
            if (game.status[currentCell.getAttribute("data-index")] !== "" || !game.active) {
                return;
            }
            drawCurrentPlayer(currentCell);
            checkGame();
            handleGameStateUpdate();
        });
    });
}

function getPlayerData() {
    player.name.first = "Heibert";
    player.name.first = "Joseph"
}

function addControlCell() {
    game.cells.forEach((el, index) => {
        boxGame.insertAdjacentHTML("beforeend", `<div data="${el}" data-index="${index}" class="item control-cell"></div>`);
    });
}

function drawCurrentPlayer(el) {
    // add player symbol
    game.status[el.getAttribute("data-index")] = player.currently;
    // insert symbol into cell 
    el.insertAdjacentHTML("afterbegin", `<span class="value ${player.currently == "X" ? "first_color_value" : "second_color_value"
        }">${player.currently}</span>`);
    // cell shadow
    el.style.boxShadow = `0px 5px 5px ${player.currently == "X" ? "var(--first-color-value)" : "var(--second-color-value)"}`;
    // get previous move 
    let name = player.currently == "X" ? player.name.first : player.name.second;
    player.winner = `${name} "${player.currently}"`;
    // Player turn update
    player.currently = player.currently == "X" ? "O" : "X";
}

function checkGame() {
    let isWinner = false;
    let a, b, c;

    for (let i = 0; i < game.winningPlays.length; i++) {
        a = game.status[game.winningPlays[i][0]];
        b = game.status[game.winningPlays[i][1]];
        c = game.status[game.winningPlays[i][2]];


        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            isWinner = true;
            break;
        }
    }

    // Is winner
    if (isWinner) {
        game.active = false;
        game.statusMessage = `The winner is ${player.winner}`;
        return;
    }

    // Game over
    if (!game.status.includes("")) {
        game.active = false;
        game.statusMessage = "This game ended in a draw!";
        return;
    }


}

// Functionality that waiting for change to update the state of the game
function handleGameStateUpdate() {
    currentPlayer.innerHTML = player.currently;
    statusDisplay.innerHTML = game.statusMessage;
}

function playAgain() {
    let cellElement = document.querySelectorAll(".control-cell");
    cellElement.forEach(el => {
        el.style.boxShadow = "0px 5px 5px var(--shadow2)";
        el.innerHTML = "";
    });
    currentPlayer.innerHTML = "X";
    statusDisplay.innerHTML = "";

    // reset game state
    game.active = true;
    game.status = ["", "", "", "", "", "", "", "", ""];
    game.statusMessage = "";
}

function playAnotherGame() {
    // reset game state
    game.active = true;
    game.status = ["", "", "", "", "", "", "", "", ""];
    game.statusMessage = "";
}