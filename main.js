const N = 7 * 7;
let nums = Array.from({ length: N }, (_, i) => i + 1);
for (let i = 0; i < N; i++) {
    let j = Math.floor(Math.random() * N);
    [nums[i], nums[j]] = [nums[j], nums[i]];
}


document.addEventListener("DOMContentLoaded", function () {
    let screen = document.getElementById("screen");

    for (let i = 0; i < 7 * 7; i++) {
        let squareDiv = document.createElement("div");
        squareDiv.classList.add("square");

        let picDiv = document.createElement("div");
        picDiv.classList.add("pic");

        let textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = nums[i];

        squareDiv.appendChild(picDiv);
        squareDiv.appendChild(textDiv);

        squareDiv.addEventListener("click", function () {
            this.classList.toggle("gone");
        });

        screen.appendChild(squareDiv);
    }
});