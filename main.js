document.addEventListener("DOMContentLoaded", function () {
    let screen = document.getElementById("screen");

    for (let i = 0; i < 64; i++) {
        let squareDiv = document.createElement("div");
        squareDiv.classList.add("square");

        let picDiv = document.createElement("div");
        picDiv.classList.add("pic");

        let textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = i;

        squareDiv.appendChild(picDiv);
        squareDiv.appendChild(textDiv);

        squareDiv.addEventListener("click", function () {
            this.classList.toggle("gone");
        });

        screen.appendChild(squareDiv);
    }
});