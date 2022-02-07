import { makeObservable, observable, action, runInAction } from "mobx";
import * as Tone from "tone";

import PieceService from "../PieceService";

const NOTES = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];
const makeGrid = (notes) => {
    const rows = [];
    for (const note of notes) {
        const row = [];
        for (let i = 0; i < 8; i++) {
            row.push({
                note: note,
                active: false,
            });
        }
        rows.push(row);
    }
    return rows;
};
class PieceStore {
    id = "";
    name = "";
    bars = new Array(1).fill(makeGrid(NOTES));
    barsIds = [];
    activeBarIdx = 0;
    allPieces = [];
    popupView = false;
    uploadPopupView = false;
    piecePlaying = false;
    deleteIdx = 0;

    constructor(rootStore) {
        makeObservable(this, {
            id: observable,
            name: observable,
            bars: observable,
            barsIds: observable,
            activeBarIdx: observable,
            allPieces: observable,
            popupView: observable,
            uploadPopupView: observable,
            piecePlaying: observable,
            deleteIdx: observable,
            setPieceId: action,
            deletePieceView: action,
            sortPieces: action,
            setPieceName: action,
            setPiece: action,
            setBar: action,
            setPieceById: action,
            addBar: action,
            deleteBar: action,
            reset: action,
            changeActiveBar: action,
            deletePieceAndBars: action,
            playPiece: action,
            togglePiecePlay: action,
            showPopup: action,
            showUploadPopup: action,
            setDeleteIdx: action,
        });

        this.rootStore = rootStore;
        this.pieceService = new PieceService();
        this.rootStore.barStore.notes = this.bars[this.activeBarIdx];
    }
    getPiecesAsync = async () => {
        const pieces = await this.pieceService.get("Piece");
        runInAction(() => {
            this.allPieces = pieces.item;
        });
    };
    postPieceAsync = async () => {
        let ids = [];
        for (let i = 0; i < this.bars.length; i++) {
            this.changeActiveBar(i);
            const barObj = await this.rootStore.barStore.postBarAsync();
            ids.push(barObj.id);
        }
        this.setBarIds(ids);
        const pieceProps = {
            name: this.name,
            bars_ids: this.barsIds,
        };
        const { response, responseJson } = await this.pieceService.post(
            "Piece",
            pieceProps
        );
        return response;
    };
    putPieceAsync = async () => {
        let ids = [];
        for (let i = 0; i < this.bars.length; i++) {
            this.changeActiveBar(i);

            if (i + 1 > this.barsIds.length) {
                const barObj = await this.rootStore.barStore.postBarAsync();
                ids.push(barObj.id);
            } else {
                let id = this.barsIds[i];
                const barObj = await this.rootStore.barStore.putBarAsync(id);
                ids.push(id);
            }
        }
        this.setBarIds(ids);
        const pieceProps = {
            id: this.id,
            name: this.name,
            bars_ids: this.barsIds,
        };
        const response = await this.pieceService.put("Piece", pieceProps);
        return response;
    };
    uploadPiece = async () => {
        let response;
        if (this.id) {
            response = await this.putPieceAsync();
        } else {
            response = await this.postPieceAsync();
        }
        if (response.ok) {
            this.showUploadPopup();
        }
    };
    deletePieceAsync = async (pieceIdx) => {
        const selectedPiece = this.allPieces[pieceIdx];
        const { bars_ids, id, name } = selectedPiece;
        bars_ids.forEach((barId) => {
            this.rootStore.barStore.deleteBarsAsync({
                barId: barId,
                barIdx: null,
            });
        });
        const response = this.pieceService.delete("Piece", id);
        this.deletePieceView(pieceIdx);
    };
    deletePieceAndBars(pieceTab) {
        if (pieceTab) {
            this.deletePieceAsync(this.deleteIdx);
        } else {
            this.rootStore.barStore.deleteBarsAsync({
                barId: null,
                barIdx: this.deleteIdx,
            });
            this.rootStore.barStore.deleteBarsView(this.deleteIdx);
        }
    }
    deletePieceView(pieceIdx) {
        this.allPieces.splice(pieceIdx, 1);
    }
    setPieceId(id) {
        this.id = id;
    }
    setPieceName(name) {
        this.name = name;
    }
    setBarIds(ids) {
        this.barsIds = ids;
    }
    resetPieceId() {
        this.id = "";
    }
    setPiece(idx) {
        const selectedPiece = this.allPieces[idx];
        this.setPieceAttributes(selectedPiece);
    }
    setPieceById(pieceId) {
        const selectedPiece = this.allPieces.filter(
            (piece) => piece.id === pieceId
        );
        this.setPieceAttributes(selectedPiece[0]);
    }
    setPieceAttributes(selectedPiece) {
        const { bars_ids, id, name } = selectedPiece;

        this.setPieceId(id);
        this.setPieceName(name);
        this.setBarIds(bars_ids);

        const allBars = this.rootStore.barStore.allBars;
        const bars = allBars
            .filter((bar) => bars_ids.includes(bar.id))
            .map((bar) => {
                return bar.notes;
            });
        this.bars = bars;
        this.changeActiveBar(0);
    }
    filterBars(idx) {
        const selectedPiece = this.allPieces[idx];
        const bars_ids = selectedPiece.bars_ids;
        const allBars = this.rootStore.barStore.allBars;

        const filteredBars = allBars.filter((bar) => bars_ids.includes(bar.id));

        this.rootStore.barStore.setViewBars(filteredBars);
    }
    setBar(idx) {
        const selectedBar = this.rootStore.barStore.viewBars[idx];
        const notes = selectedBar.notes;
        this.bars[0] = notes;
        this.changeActiveBar(0);
    }
    sortPieces() {
        const compare = (a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        };
        const sortedPieces = this.allPieces.sort(compare);
        this.allPieces = sortedPieces;
    }
    addBar() {
        this.bars.push(makeGrid(NOTES));
        this.changeActiveBar(this.bars.length - 1);
    }
    deleteBar(idx) {
        if (this.bars.length !== 1) {
            this.bars.splice(idx, 1);
            this.changeActiveBar(Math.max(0, idx - 1));
        }
    }
    setDeleteIdx(idx) {
        this.deleteIdx = idx;
    }
    changeActiveBar(idx) {
        this.activeBarIdx = idx;
        this.rootStore.barStore.notes = this.bars[this.activeBarIdx];
    }
    showPopup() {
        this.popupView = !this.popupView;
    }
    showUploadPopup() {
        this.uploadPopupView = !this.uploadPopupView;
    }
    playPiece() {
        let notesList = new Array(8 * this.bars.length);
        let i = 0;
        this.bars.forEach((notes, barIdx) => {
            for (let beat = 0; beat < 8; beat++) {
                let notesAtBeat = [];
                notes.forEach((row, rowIdx) => {
                    const note = row[beat];
                    note.active && notesAtBeat.push(note.note);
                });
                if (notesAtBeat.length > 1) {
                    notesList[i] = notesAtBeat;
                } else if (notesAtBeat.length === 1) {
                    notesList[i] = notesAtBeat[0];
                }
                i++;
            }
        });
        const polySynth = new Tone.PolySynth();
        const dist = new Tone.Distortion(
            this.rootStore.oscillatorStore.distortionAmount
        );
        const volume = new Tone.Volume(-5);
        polySynth.chain(dist, volume, Tone.Destination);

        const synthParams = this.rootStore.oscillatorStore.synth.get();
        polySynth.set(synthParams);

        let beat = 0;
        const loop = new Tone.Loop((time) => {
            const notes = notesList[beat];
            polySynth.triggerAttackRelease(notes, "8n", time);

            beat % 8 === 0 && this.changeActiveBar(beat / 8);

            beat = (beat + 1) % notesList.length;
        }, "8n").start();

        if (!this.piecePlaying) {
            Tone.Transport.start();
            this.togglePiecePlay();
        } else {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            this.togglePiecePlay();
        }
    }
    togglePiecePlay() {
        this.piecePlaying = !this.piecePlaying;
    }
    get getBars() {
        return this.bars;
    }
    logBars = () => {
        console.log("piece Bars", this.getBars);
    };
    reset() {
        this.id = "";
        this.name = "";
        this.bars = new Array(1).fill(makeGrid(NOTES));
        this.barsIds = [];
        this.activeBarIdx = 0;
        this.changeActiveBar(0);
    }
}

export default PieceStore;
