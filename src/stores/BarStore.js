import { makeObservable, observable, action, runInAction } from "mobx";
import PieceService from "../PieceService";

class BarStore {
    id = "";
    notes = [];
    //pieceId = "";
    allBars = [];
    viewBars = [];

    sequencerStarted = false;
    sequencerPlaying = false;

    rootStore;

    constructor(rootStore) {
        makeObservable(this, {
            id: observable,
            notes: observable,
            //pieceId: observable,
            allBars: observable,
            viewBars: observable,
            sequencerStarted: observable,
            sequencerPlaying: observable,
            setViewBars: action,
            resetViewBars: action,
            updateNotes: action,
            toggleSequencerStarted: action,
            toggleSequencerPlaying: action,
        });
        this.rootStore = rootStore;
        this.pieceService = new PieceService();
    }
    getBarsAsync = async () => {
        const bars = await this.pieceService.get("Bar");
        runInAction(() => {
            this.allBars = bars.item;
            this.viewBars = bars.item;
        });
    };
    postBarAsync = async () => {
        const barProps = { notes: this.notes };
        const responseJson = this.pieceService.post("Bar", barProps);
        return responseJson;
    };
    resetViewBars() {
        this.viewBars = this.allBars;
    }
    setViewBars(bars) {
        this.viewBars = bars;
    }
    updateNotes(rowIdx, noteIdx) {
        let note = this.notes[rowIdx][noteIdx];
        note.active = !note.active;
    }
    toggleSequencerStarted() {
        this.sequencerStarted = !this.sequencerStarted;
    }
    toggleSequencerPlaying() {
        this.sequencerPlaying = !this.sequencerPlaying;
    }
}

export default BarStore;
