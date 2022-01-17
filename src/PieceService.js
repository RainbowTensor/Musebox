const webApiUrl = "https://api.baasic.com/v1/musebox/";

class PieceService {
    get = async (resourceName) => {
        const options = {
            method: "GET",
        };
        const url = webApiUrl + `resources/${resourceName}/`;
        const response = await fetch(url, options);
        const responseJson = response.json();
        return responseJson;
    };
    post = async (resourceName, pieceProps) => {
        const options = {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(pieceProps),
            method: "POST",
        };
        const url = webApiUrl + `resources/${resourceName}/`;
        const response = await fetch(url, options);
        const responseJson = response.json();
        return responseJson;
    };
    put = async (resourceName, pieceProps) => {
        const options = {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(pieceProps),
            method: "PUT",
        };
        const url = webApiUrl + `resources/${resourceName}/${pieceProps.id}`;
        const response = await fetch(url, options);
        return response;
    };
    delete = async (resourceName, pieceId) => {
        const options = {
            method: "DELETE",
        };
        const url = webApiUrl + `resources/${resourceName}/${pieceId}`;
        const response = await fetch(url, options);
        return response;
    };
}

export default PieceService;
