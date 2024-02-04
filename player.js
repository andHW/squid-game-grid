export default class Player {
    constructor(id, picUrl) {
        this.id = id;
        this.picUrl = picUrl;
        this.eliminated = false;
    }

    getId = () => this.id;
    getPicUrl = () => this.picUrl;
    isEliminated = () => this.eliminated;
    setEliminated = (eliminated) => this.eliminated = eliminated;
}