const webApiUrl = "https://api.baasic.com/v1/musebox/";

class PieceService {
    getAllPieces = async () => {
        const options = {
            method: "GET",
        };
        const url = webApiUrl + `resources/Piece/`;
        const response = await fetch(url, options);
        const responseJson = response.json();

        console.log("response", responseJson);
        return responseJson;
    };
    postPiece = async (pieceProps) => {
        const options = {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(pieceProps),
            method: "POST",
        };
        const url = webApiUrl + `resources/Piece/`;
        const response = await fetch(url, options);
        const responseJson = response.json();
    };
}

export default PieceService;
