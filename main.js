// should create a Game object to manintain states and handle events better

import Player from "./player.js";

const DEFAULT_NUM_OF_PLAYERS = 37;
const CONFIG_PATH = "config.json";

async function main() {
    let players = await initPlayers();
    genSquares(players);

    let squareSideSize = Math.ceil(Math.sqrt(players.length));

    resetDimensions(squareSideSize);
    onresize = (event) => {
        resetDimensions(squareSideSize);
    };
}

async function initPlayers() {
    let players = [];

    await fetch(CONFIG_PATH)
        .then(response => response.json())
        .then(json => {
            json.players.forEach((player) => {
                players.push(new Player(player.id, player.picUrl));
            });
        })
        .catch((e) => {
            console.log("config.json not found, using default players");
            for (let i = 1; i <= DEFAULT_NUM_OF_PLAYERS; i++) {
                players.push(new Player(i, "456.webp"));
            }
        });

    return players;
}


function genSquares(players) {
    let numOfPlayers = players.length;
    let squareSideSize = Math.ceil(Math.sqrt(numOfPlayers));
    let numOfSquares = squareSideSize ** 2;

    let nums = Array.from({ length: numOfSquares }, (_, i) => i + 1);

    // shuffle nums
    for (let i = 0; i < numOfSquares; i++) {
        let j = Math.floor(Math.random() * numOfSquares);
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    let screen = document.getElementById("screen");
    screen.innerHTML = "";

    for (let i = 0; i < numOfSquares; i++) {
        let squareDiv = document.createElement("div");
        squareDiv.classList.add("square");
        let player = players[nums[i] - 1];

        if (nums[i] > numOfPlayers || player.isEliminated()) {
            squareDiv.classList.add("empty");
            screen.appendChild(squareDiv);
            continue;
        }

        squareDiv.setAttribute("playerId", player.getId());

        let picDiv = document.createElement("div");
        picDiv.classList.add("pic");
        picDiv.style.backgroundImage = `url(${player.getPicUrl()})`;

        let textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = player.getId().toString().padStart(3, "0");

        squareDiv.appendChild(picDiv);
        squareDiv.appendChild(textDiv);

        squareDiv.addEventListener("click", function () {
            togglePlayer(this);
        });

        screen.appendChild(squareDiv);
    }

}

async function togglePlayer(squareElm) {
    if (squareElm.classList.contains("gone")) {
        return;
    }

    // reset all squares if all squares are gone
    let numOfRemainingSquares = document.querySelectorAll(".square:not(.gone, .empty)").length;

    if (numOfRemainingSquares > 1) {
        new Audio("sg-sound-effect.ogg").play();
        squareElm.classList.add("gone");
        return;
    }

    if (numOfRemainingSquares === 1) {
        let players = await initPlayers();
        genSquares(players);
        let squareSideSize = Math.ceil(Math.sqrt(players.length));
        resetDimensions(squareSideSize);

        new Audio("sg-sound-effect-rev.ogg").play();
        return;
    }
}

function togglePlayerById(playerId) {
    let square = document.querySelector(`.square[playerId="${playerId}"]`);
    togglePlayer(square);
}

function resetDimensions(squareSideSize) {
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

// for debugging
window.resetDimensions = resetDimensions;