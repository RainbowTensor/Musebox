import BarStore from "./BarStore";
import PieceStore from "./PieceStore";

class RootStore {
    constructor() {
        this.barStore = new BarStore(this);
        this.pieceStore = new PieceStore(this);
    }
}

export default RootStore;
