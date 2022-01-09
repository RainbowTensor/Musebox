import { makeObservable, observable, action, autorun, runInAction } from "mobx";
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
    pieceTab = true;

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
            pieceTab: observable,
            //setPieceId:action,
            setPieceName: action,
            setPiece: action,
            setBar: action,
            //appendBar: action,
            changeActiveBar: action,
            toggleTableView: action,
            toggleTabs: action,
        });
        autorun(this.logBars);
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
            console.log("POST response", response);
        });
    };
    setPieceId(id) {
        this.id = id;
    }
    setPieceName(name) {
        this.name = name;
    }
    setBarIds(ids) {
        this.barsIds = ids;
    }
    // is this in use?
    //appendBar(idx) {
    //    this.bars[idx] = {
    //        notes: this.rootStore.barStore.notes,
    //        id: this.rootStore.barStore.id,
    //    };
    //}
    setPiece(idx) {
        console.log(this.allPieces);
        const selectedPiece = this.allPieces[idx];
        const { bars_ids, id, name } = selectedPiece;

        this.setBarIds(id);
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
        const { bars_ids, id, name } = selectedPiece;
        const allBars = this.rootStore.barStore.allBars;

        const filteredBars = allBars.filter((bar) => bars_ids.includes(bar.id));

        this.rootStore.barStore.setViewBars(filteredBars);
    }
    setBar(idx) {
        const selectedBar = this.rootStore.barStore.allBars[idx];
        const { id, notes } = selectedBar;
        this.bars[0] = notes;
        this.changeActiveBar(0);
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
    get getBars() {
        return this.bars;
    }
    logBars = () => {
        console.log("piece Bars", this.getBars);
    };
}

export default PieceStore;
