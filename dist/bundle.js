const defaults = {
    timeout: 600000
};
function SendXhrData(params) {
    const HttpExecutor = (resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        const HandleLoad = (ev)=>{
            console.log("HandleLoad");
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
                if (params.consoleInfo) console.group(params.consoleInfo);
                console.log(`${ev.loaded} bytes loaded.`);
                if (params.consoleInfo) console.groupEnd();
            } else {
                reject(new Error(`HTML status code ${xhr.status}`));
            }
        };
        const HandleError = (ev)=>{
            reject(new Error("jXhr: failed to send request!"));
            if (params.consoleInfo) console.group(params.consoleInfo);
            console.log(ev);
            console.error(`xhr.status ${xhr.status}`);
            if (params.consoleInfo) console.groupEnd();
        };
        const HandleProgress = (ev)=>{
            if (ev.lengthComputable) {
                const percentComplete = ev.loaded / ev.total * 100;
                if (params.progress) params.progress(percentComplete, ev.loaded);
            } else {
                if (params.progress) params.progress(-1, ev.loaded);
            }
        };
        xhr.open(params.method, params.url);
        if (params.reqHeaders) {
            params.reqHeaders.forEach((h)=>{
                if (h.header !== "" && h.value !== "") {
                    console.log(`Setting custom request header '${h.header}, ${h.value}'`);
                    xhr.setRequestHeader(h.header, h.value);
                }
            });
        }
        xhr.timeout = params.timeout ? params.timeout : defaults.timeout;
        xhr.responseType = params.respType;
        xhr.addEventListener("load", HandleLoad);
        xhr.addEventListener("error", HandleError);
        xhr.addEventListener("progress", HandleProgress);
        if (params.loadend) xhr.addEventListener("loadend", params.loadend);
        if (params.abort) xhr.addEventListener("abort", params.abort);
        xhr.send(params.data);
        if (params.xhrReference) params.xhrReference(xhr);
    };
    return new Promise(HttpExecutor);
}
const SendXhrData1 = SendXhrData;
const startButton = document.querySelector("#startButton");
const abortButton = document.querySelector("#abortButton");
const loadProgress = document.querySelector("#loadProgress");
const loadBytes = document.querySelector("#loadBytes");
let pointerToXhr = null;
async function TryToSendData() {
    let response;
    const myRequestHeaders = [];
    const xhrOptions = {
        method: "get",
        url: "https://api.covidtracking.com/v1/states/daily.json",
        data: "my test",
        respType: "json",
        reqHeaders: myRequestHeaders,
        timeout: 15000,
        consoleInfo: "Connecting...",
        loadend: OnLoadEnd,
        progress: OnProgress,
        abort: OnAbort,
        xhrReference: ObtainXhrReference
    };
    try {
        response = await SendXhrData1(xhrOptions);
        if (response && response.status === 200) {
            console.log("JSON response with 200, good! JSON below.");
        } else {
            console.log("HTML response OK, but JSON response.status not 200. JSON below.");
        }
    } catch (error) {
        console.log("TryToSendForm error: something went wrong...");
        console.error(error);
    }
}
function OnProgress(percent, bytes) {
    if (loadProgress) loadProgress.value = percent;
    if (loadBytes) loadBytes.innerText = bytes + " bytes";
}
function OnAbort() {
    console.log("OnAbort called!");
}
function OnLoadEnd() {
    console.log("OnLoadEnd called!");
}
function OnStartButtonClick() {
    console.log("start OnStartButtonClick");
    TryToSendData();
    console.log("end OnStartButtonClick");
}
function ObtainXhrReference(link) {
    pointerToXhr = link;
}
function OnAbortButtonClick() {
    console.log("start OnAbortButtonClick");
    console.dir(pointerToXhr);
    if (pointerToXhr) pointerToXhr.abort();
    console.log("end OnAbortButtonClick");
}
if (startButton) startButton.addEventListener("click", OnStartButtonClick);
if (abortButton) abortButton.addEventListener("click", OnAbortButtonClick);
