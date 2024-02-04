import { genPlayers } from "./player.js";

const CONFIG_PATH = "config.json";

class Game {
    constructor(players, screenElm) {
        this.players = players;
        this.screenElm = screenElm;
        this.refreshScreen();

        onresize = (event) => {
            this.resetDimensions();
        };
    }

    #getNumOfAlivePlayers = () => this.players.filter((player) => player.isAlive()).length;
    #resurrectAllPlayers = () => this.players.forEach((player) => player.setAlive(true));

    // some squares may be empty if the number of players is not a perfect square (e.g. 37 players, 7x7 grid, 12 empty squares)
    getSquareSideSize = () => Math.ceil(Math.sqrt(this.players.length));

    resetDimensions = () => {
        let squareSideSize = this.getSquareSideSize();
        let screen = this.screenElm;
        screen.style.gridTemplateColumns = `repeat(${squareSideSize}, 1fr)`;

        let squareDiagonal = Math.ceil((squareSideSize + .5) * Math.sqrt(2));
        let vx = Math.floor(100 / (squareDiagonal));
        let useVWorVH = document.documentElement.clientHeight < document.documentElement.clientWidth ? "vh" : "vw";

        let squares = screen.querySelectorAll(".square");
        squares.forEach((square) => { square.style.height = `${vx}${useVWorVH}`; square.style.margin = `${vx / 40}${useVWorVH}`; });

        let text = screen.querySelectorAll(".text");
        text.forEach((text) => {
            text.style.transform = `rotate(45deg) translateY(${vx / 3}${useVWorVH})`;
            text.style.fontSize = `${vx / 3}${useVWorVH}`;
        });
    }

    #clickSquare(squareElm, playerId) {
        if (squareElm.classList.contains("gone")) {
            return;
        }
        this.players[playerId].setAlive(false);
        if (this.#getNumOfAlivePlayers() > 0) {
            new Audio("sg-sound-effect.ogg").play();
            squareElm.classList.add("gone");
            return;
        }

        // reset game if only one player is left
        this.#resurrectAllPlayers();
        this.refreshScreen();
        new Audio("sg-sound-effect-rev.ogg").play();
    }

    refreshScreen() {
        this.screenElm.innerHTML = "";
        let numOfSquares = this.getSquareSideSize() ** 2;

        let squaresOrder = Array.from({ length: numOfSquares }, (_, i) => i);
        squaresOrder.sort(() => Math.random() - 0.5);

        for (let i = 0; i < numOfSquares; i++) {
            let squareDiv = document.createElement("div");
            squareDiv.classList.add("square");

            let order = squaresOrder[i];

            if (order >= this.players.length) {
                squareDiv.classList.add("empty");
                this.screenElm.appendChild(squareDiv);
                continue;
            }

            let player = this.players[order];

            squareDiv.setAttribute("playerNumber", player.getNumber());

            let picDiv = document.createElement("div");
            picDiv.classList.add("pic");
            picDiv.style.backgroundImage = `url(${player.getPicUrl()})`;

            let textDiv = document.createElement("div");
            textDiv.classList.add("text");
            textDiv.textContent = player.getNumber().toString().padStart(3, "0");

            squareDiv.appendChild(picDiv);
            squareDiv.appendChild(textDiv);

            squareDiv.addEventListener("click", this.#clickSquare.bind(this, squareDiv, order));

            this.screenElm.appendChild(squareDiv);
        }
        this.resetDimensions();
    }
}

async function main() {
    let players = await genPlayers(CONFIG_PATH);
    let game = new Game(players, document.getElementById("screen"));
}

function foo(squareSideSize) {
    let screen = document.getElementById("screen");
    screen.style.gridTemplateColumns = `repeat(${squareSideSize}, 1fr)`;

    let squareDiagonal = Math.ceil((squareSideSize + .5) * Math.sqrt(2));
    let vx = Math.floor(100 / (squareDiagonal));
    let useVWorVH = document.documentElement.clientHeight < document.documentElement.clientWidth ? "vh" : "vw";

    let squares = document.querySelectorAll(".square");
    squares.forEach((square) => { square.style.height = `${vx}${useVWorVH}`; square.style.margin = `${vx / 40}${useVWorVH}`; });

    let text = document.querySelectorAll(".text");
    text.forEach((text) => {
        text.style.transform = `rotate(45deg) translateY(${vx / 3}${useVWorVH})`;
        text.style.fontSize = `${vx / 3}${useVWorVH}`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});