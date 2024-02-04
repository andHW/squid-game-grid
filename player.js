export default class Player {
    constructor(number, picUrl) {
        this.number = number;
        this.picUrl = picUrl;
        this.alive = true;
    }

    getNumber = () => this.number;
    getPicUrl = () => this.picUrl;
    isAlive = () => this.alive;
    setAlive = (alive) => this.alive = alive;
}

const DEFAULT_NUM_OF_PLAYERS = 37;
function genDefaultPlayers() {
    let players = [];
    for (let i = 1; i <= DEFAULT_NUM_OF_PLAYERS; i++) {
        players.push(new Player(i, "456.webp"));
    }
    return players;
}

export async function genPlayers(configPath) {
    let players = [];
    await fetch(configPath)
        .then(response => response.json())
        .then(json => {
            json.players.forEach((player) => {
                players.push(new Player(player.number, player.picUrl));
            });
        })
        .catch(() => {
            console.log("config.json not found, using default players");
            genDefaultPlayers();
        });
    return players;
}