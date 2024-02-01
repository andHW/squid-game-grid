const NUM_OF_PLAYERS = 37;
const SQUARE_SIDE_SIZE = Math.ceil(Math.sqrt(NUM_OF_PLAYERS));
const NUM_OF_SQUARES = SQUARE_SIDE_SIZE ** 2;

let nums = Array.from({ length: NUM_OF_SQUARES }, (_, i) => i + 1);

// shuffle nums
for (let i = 0; i < NUM_OF_SQUARES; i++) {
    let j = Math.floor(Math.random() * NUM_OF_SQUARES);
    [nums[i], nums[j]] = [nums[j], nums[i]];
}

function genSquares() {
    let screen = document.getElementById("screen");

    for (let i = 0; i < NUM_OF_SQUARES; i++) {
        let squareDiv = document.createElement("div");
        squareDiv.classList.add("square");

        if (nums[i] > NUM_OF_PLAYERS) {
            squareDiv.classList.add("empty");
            screen.appendChild(squareDiv);
            continue;
        }

        let picDiv = document.createElement("div");
        picDiv.classList.add("pic");

        let textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = nums[i].toString().padStart(3, "0");

        squareDiv.appendChild(picDiv);
        squareDiv.appendChild(textDiv);

        // TODO: decouple this
        squareDiv.addEventListener("click", function () {
            if (!this.classList.contains("gone")) {
                new Audio("sg-sound-effect.ogg").play();
            }
            this.classList.toggle("gone");
        });

        screen.appendChild(squareDiv);
    }

}

let style = document.createElement('style');
function setDimensions() {
    let screen = document.getElementById("screen");
    screen.style.gridTemplateColumns = `repeat(${SQUARE_SIDE_SIZE}, 1fr)`;

    //remove all rules from style
    while (style.sheet.cssRules.length > 0) {
        style.sheet.deleteRule(0);
    }

    let vx = Math.floor(100 / (SQUARE_SIDE_SIZE + 3)) - 1;
    let use_vw_or_vh = window.screen.height < window.screen.width ? "vh" : "vw";

    // insert rule into style
    style.sheet.insertRule(`.square {height: ${vx}${use_vw_or_vh};}`);
    style.sheet.insertRule(`.text {transform: rotate(45deg) translateY(${vx / 3}${use_vw_or_vh});}`);
    style.sheet.insertRule(`.text {font-size: ${vx / 3}${use_vw_or_vh};}`);
}

document.addEventListener("DOMContentLoaded", function () {
    genSquares();

    document.head.appendChild(style);
    setDimensions();

    onresize = (event) => {
        setDimensions();
    };
});