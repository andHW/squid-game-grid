export default class Player {
    constructor(id, picUrl) {
        this.id = id;
        this.picUrl = picUrl;
    }

    getId = () => this.id;
    getPicUrl = () => this.picUrl;
}