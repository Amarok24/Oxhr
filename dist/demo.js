import { Oxhr } from "./oxhr.js";
const startButton = document.querySelector("#startButton");
const abortButton = document.querySelector("#abortButton");
const swButton = document.querySelector("#swButton");
const loadProgress = document.querySelector("#loadProgress");
const loadBytes = document.querySelector("#loadBytes");
async function FetchRandomStarWarsData() {
    const random = Math.floor(Math.random() * 10 + 1);
    let result;
    const mySimpleOptions = {
        url: `https://swapi.dev/api/people/${random}`,
        consoleInfo: "Establishing my simple test connection...",
        OnLoadEnd: () => {
            alert(result);
        }
    };
    const mySimpleConnection = new Oxhr(mySimpleOptions);
    result = await mySimpleConnection.Send();
    console.log(result);
}
const myRequestHeaders = [];
const myOptions = {
    url: "https://api.covidtracking.com/v1/states/daily.json",
    method: "get",
    responseType: "json",
    data: `{ "test": 123 }`,
    requestHeaders: myRequestHeaders,
    timeoutMs: 7000,
    consoleInfo: "Establishing my test connection...",
    OnLoadEnd: OnLoadEnd,
    OnTimeOut: OnTimeOut,
    OnProgress: OnProgress,
    OnAbort: OnAbort
};
const myConnection = new Oxhr(myOptions);
async function TryToSendData() {
    let response;
    try {
        response = await myConnection.Send();
        if (response && response.someFixedResponseData === 123) {
            console.log("We got someFixedResponseData 123");
        }
        else {
            console.log("HTML response OK, but someFixedResponseData not received.");
        }
    }
    catch (err) {
        console.log(`An error occured, but we handled it. Error message: ${err.message}`);
    }
}
function OnProgress(percent, bytes) {
    if (loadProgress)
        loadProgress.value = percent;
    if (loadBytes)
        loadBytes.innerText = bytes + " bytes";
}
function OnAbort() {
    console.log("OnAbort called!");
}
function OnLoadEnd() {
    console.log("OnLoadEnd called!");
}
function OnTimeOut() {
    console.log("OnTimeOut called!");
}
function HandleStartButtonClick() {
    console.log("start HandleStartButtonClick");
    TryToSendData();
    console.log("end HandleStartButtonClick");
}
function HandleAbortButtonClick() {
    console.log("start HandleAbortButtonClick");
    myConnection.Abort();
    console.log("end HandleAbortButtonClick");
}
if (startButton)
    startButton.addEventListener("click", HandleStartButtonClick);
if (abortButton)
    abortButton.addEventListener("click", HandleAbortButtonClick);
if (swButton)
    swButton.addEventListener("click", FetchRandomStarWarsData);
FetchRandomStarWarsData();
