import BarStore from "./BarStore";
import PieceStore from "./PieceStore";
import OscillatorStore from "./OscillatorStore";

class RootStore {
    constructor() {
        this.barStore = new BarStore(this);
        this.pieceStore = new PieceStore(this);
        this.oscillatorStore = new OscillatorStore(this);
    }
}

export default RootStore;
