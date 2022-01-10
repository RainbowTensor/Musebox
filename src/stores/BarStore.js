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
            deleteBarsView: action,
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
    deleteBarsAsync = async ({ barId, barIdx }) => {
        if (barId === null) {
            barId = this.viewBars[barIdx].id;
        }
        console.log(barId);
        const response = this.pieceService.delete("Bar", barId);
        console.log("DELETE Response", response);
    };
    deleteBarsView(barIdx) {
        const barId = this.viewBars[barIdx].id;
        const allBarsIds = this.allBars.map((bar) => {
            return bar.id;
        });
        const selectedBarIdx = allBarsIds.indexOf(barId);
        this.allBars.splice(selectedBarIdx, 1);
        this.viewBars.splice(barIdx, 1);
        console.log(this.barIdx);
    }
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
