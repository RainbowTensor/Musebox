import BarStore from "./BarStore";
import PieceStore from "./PieceStore";
import OscillatorStore from "./OscillatorStore";
import TableStore from "./TableStore";

class RootStore {
    constructor() {
        this.barStore = new BarStore(this);
        this.pieceStore = new PieceStore(this);
        this.oscillatorStore = new OscillatorStore(this);
        this.tableStore = new TableStore(this);
    }
}

export default RootStore;
