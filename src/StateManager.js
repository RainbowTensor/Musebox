import {
    makeObservable,
    observable,
    computed,
    action,
    autorun,
    runInAction,
} from "mobx";
import PieceService from "./PieceService";

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

class StateManager {
    adsr = { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.8 };
    notes = makeGrid(NOTES);
    width = 300;
    height = 200;
    padding = 11;
    points = this.createPoints(this.adsr);
    sequencerStarted = false;
    sequencerPlaying = false;
    toggleOscillator = false;
    toggleTable = true;

    allPieces = [];
    pieceId = "";

    constructor() {
        makeObservable(this, {
            adsr: observable,
            points: observable,
            notes: observable,
            sequencerStarted: observable,
            sequencerPlaying: observable,
            toggleOscillator: observable,
            toggleTable: observable,
            allPieces: observable,
            pieceId: observable,
            createPoints: action,
            claculateADSR: action,
            updatePoints: action,
            updateNotes: action,
            toggleSequencerStarted: action,
            toggleSequencerPlaying: action,
            toggleOscillatorView: action,
            toggleTableView: action,
            setNotes: action,
            pointsInfo: computed,
        });

        this.pieceService = new PieceService();

        autorun(this.logPoints);
        //console.log(JSON.stringify(this.proporties));
    }
    getPiecesAsync = async () => {
        const pieces = await this.pieceService.getAllPieces();
        runInAction(() => {
            this.allPieces = pieces.item;
        });
    };
    postPieceAsync = async () => {
        if (this.pieceId) {
            const pieceProps = {
                adsr: this.adsr,
                notes: this.notes,
                id: this.pieceId,
            };
            const pieceData = await this.pieceService.putPiece(pieceProps);
        } else {
            const pieceProps = {
                adsr: this.adsr,
                notes: this.notes,
            };
            const pieceData = await this.pieceService.postPiece(pieceProps);
        }
    };
    setNotes(idx) {
        const selectedPiece = this.allPieces[idx];
        this.adsr = selectedPiece.adsr;
        this.notes = selectedPiece.notes;
        this.pieceId = selectedPiece.id;
    }
    createPoints(adsr) {
        const createObject = (x, y, draggable) => {
            //console.log("xy", x, y);
            return {
                x: x,
                y: y,
                draggable: draggable,
                dragging: false,
                screenX: 0,
                screenY: 0,
            };
        };
        const { attack, decay, sustain, release } = adsr;
        const points = [];
        points.push(createObject(this.padding, this.height, false));
        let x,
            y = this.padding;

        // attack
        x = this.width * attack;
        // y = 0;
        points.push(createObject(x, y, true));

        //decay
        x = this.width * decay + x;
        y = this.height - this.height * sustain;
        points.push(createObject(x, y, true));

        // sustain
        var size = 0.2;
        x = size * this.width + x;
        points.push(createObject(x, y, true));

        // release
        x = this.width;
        y = this.height;
        points.push(createObject(x, y, false));

        return points;
    }
    claculateADSR() {
        const points = this.points;
        const attack = points[1].x / this.width;
        const decay = points[2].x / this.width;
        const sustain = 1 - points[2].y / this.height;
        const release = 1 - points[3].x / this.width;
        this.adsr = {
            attack: attack,
            decay: decay,
            sustain: sustain,
            release: release,
        };
    }
    updatePoints(newValues, idx) {
        const { x, y, draggable, dragging, screenX, screenY } = newValues;
        this.points[idx] = {
            x: x !== null ? x : this.points[idx].x,
            y: y !== null ? y : this.points[idx].y,
            draggable:
                draggable !== null ? draggable : this.points[idx].draggable,
            dragging: dragging !== null ? dragging : this.points[idx].dragging,
            screenX: screenX !== null ? screenX : this.points[idx].screenX,
            screenY: screenY !== null ? screenY : this.points[idx].screenY,
        };
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
    toggleOscillatorView() {
        this.toggleOscillator = !this.toggleOscillator;
    }
    toggleTableView() {
        this.toggleTable = !this.toggleTable;
    }
    get pointsInfo() {
        return this.points;
    }
    logPoints = () => {
        console.log(this.pointsInfo);
    };
}

export default StateManager;
