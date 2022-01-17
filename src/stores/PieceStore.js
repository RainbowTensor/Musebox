import { makeObservable, observable, action, autorun, runInAction } from "mobx";
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
    bars = new Array(4).fill(makeGrid(NOTES));
    barsIds = [];
    activeBarIdx = 0;
    allPieces = [];
    tableView = true;
    popupView = false;
    pieceTab = true;
    deleteIdx = 0;

    rootStore;

    constructor(rootStore) {
        makeObservable(this, {
            id: observable,
            name: observable,
            bars: observable,
            barsIds: observable,
            activeBarIdx: observable,
            allPieces: observable,
            tableView: observable,
            popupView: observable,
            pieceTab: observable,
            deleteIdx: observable,
            setPieceId: action,
            deletePieceView: action,
            sortPieces: action,
            setPieceName: action,
            setPiece: action,
            setBar: action,
            setPieceById: action,
            reset: action,
            changeActiveBar: action,
            deletePieceAndBars: action,
            toggleTableView: action,
            showPopup: action,
            setDeleteIdx: action,
            toggleTabs: action,
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
        //this.rootStore.barStore.getBarsAsync();
    };
    postPieceAsync = async () => {
        const range = [...Array(this.bars.length).keys()];
        const promises = range.map((i) => {
            this.changeActiveBar(i);
            const promise = this.rootStore.barStore
                .postBarAsync()
                .then((result) => {
                    return result.id;
                });
            return promise;
        });

        Promise.all(promises).then(async (ids) => {
            this.setBarIds(ids);
            const pieceProps = {
                name: this.name,
                bars_ids: this.barsIds,
            };
            const response = await this.pieceService.post("Piece", pieceProps);
        });
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
    deletePieceAndBars() {
        //if (this.popupConfirm) {
        if (this.pieceTab) {
            this.deletePieceAsync(this.deleteIdx);
        } else {
            this.rootStore.barStore.deleteBarsAsync({
                barId: null,
                barIdx: this.deleteIdx,
            });
            this.rootStore.barStore.deleteBarsView(this.deleteIdx);
        }
        //}
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
        const { id, notes } = selectedBar;
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
    setDeleteIdx(idx) {
        this.deleteIdx = idx;
    }
    changeActiveBar(idx) {
        this.activeBarIdx = idx;
        this.rootStore.barStore.notes = this.bars[this.activeBarIdx];
    }
    toggleTableView() {
        this.tableView = !this.tableView;
    }
    toggleTabs() {
        this.pieceTab = !this.pieceTab;
    }
    showPopup() {
        this.popupView = !this.popupView;
    }
    transportStart() {
        Tone.Transport.start();
    }
    transportStop() {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }
    toneStart() {
        Tone.start();
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
        this.bars = new Array(4).fill(makeGrid(NOTES));
        this.barsIds = [];
        this.activeBarIdx = 0;
        this.changeActiveBar(0);
    }
}

export default PieceStore;
