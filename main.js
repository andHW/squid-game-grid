import { genPlayers } from "./player.js";

const CONFIG_PATH = "config.json";

class Game {
    constructor(players, screenElm, eliminationOrder = [], eliminateTimeSep = 1000) {
        this.players = players;
        this.screenElm = screenElm;
        this.eliminationOrder = eliminationOrder;
        this.autoRunning = true;
        this.eliminateTimeSep = eliminateTimeSep;
        this.refreshScreen();

        onresize = () => {
            this.resetDimensions();
        };

        document.body.addEventListener("click", (e) => {
            if (e.target !== e.currentTarget) {
                return;
            }

            this.toggleAuto();
        });

        if (eliminationOrder.length > 0) {
            this.runEliminateLoop();
        }
    }

    pauseAuto = () => {
        this.autoRunning = false;
    }

    // cannot be resume because it's not guaranteed that the players are in the same state as before
    restartAuto = () => {
        this.autoRunning = true;
        this.resurrectAllPlayers();
        this.refreshScreen();
    };
    toggleAuto = () => {
        if (this.autoRunning) {
            this.pauseAuto();
        }
        else {
            this.restartAuto();
        }
    };

    getNumOfAlivePlayers = () => this.players.filter((player) => player.isAlive()).length;
    resurrectAllPlayers = () => this.players.forEach((player) => player.setAlive(true));

    // some squares may be empty if the number of players is not a perfect square (e.g. 37 players, 7x7 grid, 12 empty squares)
    getSquareSideSize = () => Math.ceil(Math.sqrt(this.players.filter((player) => player.isAlive()).length));

    async runEliminateLoop() {
        while (1) {
            let eliminatedInOrder = true;
            for (let i = 0; i < this.eliminationOrder.length; i++) {
                await new Promise(r => setTimeout(r, this.eliminateTimeSep));

                if (!this.autoRunning) {
                    continue;
                }

                let playerId = this.eliminationOrder[i];
                let eliminated = this.tryToEliminatePlayer(playerId);

                if (!eliminated) {
                    console.log(`Player ${playerId} is already dead`);
                    eliminatedInOrder = false;
                    break;
                }
            }

            if (eliminatedInOrder) {
                await new Promise(r => setTimeout(r, this.eliminateTimeSep * 3));
            }
        }
    }

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

    numIsSquare = (num) => Math.sqrt(num) % 1 === 0;

    isSquareAlivesNum() {
        return this.numIsSquare(this.getNumOfAlivePlayers());
    }

    clickSquare(playerId) {
        if (this.autoRunning) {
            return;
        }
        this.tryToEliminatePlayer(playerId);
    }

    // returns true if the player was eliminated
    tryToEliminatePlayer(playerId) {
        if (!this.players[playerId]?.isAlive()) {
            return false;
        }

        let squareElm = this.screenElm.querySelector(`[playerId="${playerId}"]`);
        let audio1 = new Audio("sg-sound-effect.ogg");
        let audio2 = new Audio("sg-sound-effect-rev.ogg");

        audio1.play();
        this.players[playerId].setAlive(false);
        if (this.getNumOfAlivePlayers() > 0) {
            squareElm.classList.add("gone");

            if (this.isSquareAlivesNum()) {
                squareElm.addEventListener("transitionend", () => {
                    this.refreshScreen();
                });
            }
        }
        else {
            // maybe there's a bettet way to do the animation
            audio1.play();
            audio2.play();
            squareElm.style.scale = "2";
            squareElm.querySelector(".pic").style.filter = "none";
            audio2.addEventListener('ended', () => {
                this.resurrectAllPlayers();
                this.refreshScreen();
            });
        }
        return true;
    }

    refreshScreen() {
        this.screenElm.innerHTML = "";
        let numOfSquares = this.getSquareSideSize() ** 2;

        let alivePlayerIds = this.players
            .map((player, i) => { if (player.isAlive()) { return i; } })
            .filter((id) => id != null);

        let squaresOrder = alivePlayerIds.concat(Array(numOfSquares - alivePlayerIds.length).fill(-1));
        squaresOrder.sort(() => Math.random() - 0.5);

        for (let i = 0; i < numOfSquares; i++) {
            let squareDiv = document.createElement("div");
            squareDiv.classList.add("square");

            let order = squaresOrder[i];

            if (order == -1 || order >= this.players.length) {
                squareDiv.classList.add("empty");
                this.screenElm.appendChild(squareDiv);
                continue;
            }

            let player = this.players[order];

            squareDiv.setAttribute("playerId", order);
            squareDiv.setAttribute("playerNumber", player.getNumber());
            if (!player.isAlive()) {
                squareDiv.classList.add("gone");
            }

            let picDiv = document.createElement("div");
            picDiv.classList.add("pic");
            picDiv.style.backgroundImage = `url(${player.getPicUrl()})`;

            let textDiv = document.createElement("div");
            textDiv.classList.add("text");
            textDiv.textContent = player.getNumber().toString().padStart(3, "0");

            squareDiv.appendChild(picDiv);
            squareDiv.appendChild(textDiv);

            squareDiv.addEventListener("click", this.clickSquare.bind(this, order));

            this.screenElm.appendChild(squareDiv);
        }
        this.resetDimensions();
    }
}

async function main() {
    let players = await genPlayers(CONFIG_PATH);
    let playerIds = players.map((_, id) => id);
    let eliminationOrder = playerIds.sort(() => Math.random() - 0.5);
    let game = new Game(players, document.getElementById("screen"), eliminationOrder);
    window.game = game;
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});