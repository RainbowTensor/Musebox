import { makeObservable, observable, action, runInAction } from "mobx";
import * as Tone from "tone";
import PieceService from "../PieceService";

class BarStore {
    id = "";
    notes = [];
    allBars = [];
    viewBars = [];

    sequencerStarted = false;
    sequencerPlaying = false;

    rootStore;

    constructor(rootStore) {
        makeObservable(this, {
            id: observable,
            notes: observable,
            allBars: observable,
            viewBars: observable,
            sequencerStarted: observable,
            sequencerPlaying: observable,
            setViewBars: action,
            deleteBarsView: action,
            resetViewBars: action,
            updateNotes: action,
            togglePlay: action,
            sortBars: action,
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
        const { response, responseJson } = await this.pieceService.post(
            "Bar",
            barProps
        );
        return responseJson;
    };
    putBarAsync = async (id) => {
        const barProps = { id: id, notes: this.notes };
        const response = this.pieceService.put("Bar", barProps);
        return response;
    };
    deleteBarsAsync = async ({ barId, barIdx }) => {
        if (barId === null) {
            barId = this.viewBars[barIdx].id;
        }
        const response = this.pieceService.delete("Bar", barId);
    };
    deleteBarsView(barIdx) {
        const barId = this.viewBars[barIdx].id;
        const allBarsIds = this.allBars.map((bar) => {
            return bar.id;
        });
        const selectedBarIdx = allBarsIds.indexOf(barId);
        this.allBars.splice(selectedBarIdx, 1);
        this.viewBars.splice(barIdx, 1);
    }
    sortBars() {
        const compare = (a, b) => {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        };
        const sortedBars = this.viewBars.sort(compare);
        this.viewBars = sortedBars;
    }
    togglePlay() {
        // add to bar store
        const started = this.sequencerStarted;
        const playing = this.sequencerPlaying;

        if (!started) {
            Tone.start();
            this.rootStore.oscillatorStore.createLoop(this.notes);
            this.toggleSequencerStarted();
        }
        if (!playing) {
            Tone.Transport.start();
            this.toggleSequencerPlaying();
        } else {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            this.toggleSequencerPlaying();
            this.toggleSequencerStarted();
        }
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
