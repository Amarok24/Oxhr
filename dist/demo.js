import { Oxhr } from "./oxhr.js";
const startButton = document.querySelector("#startButton");
const abortButton = document.querySelector("#abortButton");
const swButton = document.querySelector("#swButton");
const loadProgress = document.querySelector("#loadProgress");
const loadBytes = document.querySelector("#loadBytes");
async function fetchRandomStarWarsData() {
    let response;
    const random = Math.floor(Math.random() * 10 + 1);
    const mySimpleOptions = {
        url: `https://swapi.dev/api/people/${random}`,
        consoleInfo: "Establishing my simple test connection...",
        onLoadEnd: () => {
            alert(response);
        }
    };
    const mySimpleConnection = new Oxhr(mySimpleOptions);
    response = await mySimpleConnection.send();
    console.log(response);
}
const myRequestHeaders = [];
const myOptions = {
    url: "https://api.covidtracking.com/v1/states/daily.json",
    method: "get",
    responseType: "json",
    requestHeaders: myRequestHeaders,
    timeoutMs: 7000,
    consoleInfo: "Establishing my test connection...",
    onLoadEnd: onLoadEnd,
    onTimeOut: onTimeOut,
    onProgress: onProgress,
    onAbort: onAbort
};
const myConnection = new Oxhr(myOptions);
async function tryToSendData() {
    let response;
    const myData = `{ "test": 123 }`;
    try {
        response = await myConnection.send(myData);
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
function onProgress(percent, bytes) {
    if (loadProgress)
        loadProgress.value = percent;
    if (loadBytes)
        loadBytes.innerText = bytes + " bytes";
}
function onAbort() {
    console.log("OnAbort called!");
}
function onLoadEnd() {
    console.log("OnLoadEnd called!");
}
function onTimeOut() {
    console.log("OnTimeOut called!");
}
function handleStartButtonClick() {
    console.log("start: handleStartButtonClick");
    tryToSendData();
    console.log("end: handleStartButtonClick");
}
function handleAbortButtonClick() {
    console.log("start: handleAbortButtonClick");
    myConnection.abort();
    console.log("end: handleAbortButtonClick");
}
if (startButton)
    startButton.addEventListener("click", handleStartButtonClick);
if (abortButton)
    abortButton.addEventListener("click", handleAbortButtonClick);
if (swButton)
    swButton.addEventListener("click", fetchRandomStarWarsData);
fetchRandomStarWarsData();
