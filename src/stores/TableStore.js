import { makeObservable, observable, action, runInAction } from "mobx";

class TableStore {
    showPopup = false;

    constructor(rootStore) {
        makeObservable(this, {
            showPopup: observable,
            togglePopup: action,
            confirmDelete: action,
        });
        this.rootStore = rootStore;
    }
    togglePopup() {
        this.showPopup = !this.showPopup;
    }
    confirmDelete() {
        this.togglePopup();
        this.rootStore.pieceStore.deletePieceAndBars();
    }
}

export default TableStore;
