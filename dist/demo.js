import { Oxhr } from './oxhr.js';
import { OxhrError } from './oxhr-error.js';
import { ResourcesType } from './swapi-schema.js';
const startButton = document.querySelector('#startButton');
const abortButton = document.querySelector('#abortButton');
const swButton = document.querySelector('#swButton');
const loadProgress = document.querySelector('#loadProgress');
const loadBytes = document.querySelector('#loadBytes');
async function fetchRandomStarWarsData() {
    let peopleResponse;
    const random = Math.floor(Math.random() * 10 + 1);
    const swOptions = {
        url: `https://swapi.dev/api/${ResourcesType.People}/${random}`,
        consoleMessage: 'StarWars connection finished, some details below.',
        onLoadEnd: () => {
            console.info('Opening browser pop-up message with character data...');
            alert(JSON.stringify(peopleResponse));
        },
        responseType: 'json',
        debug: false
    };
    const mySwConnection = new Oxhr(swOptions);
    console.log(`mySWConnection.instanceId = ${mySwConnection.instanceId}`);
    peopleResponse = await mySwConnection.send();
    console.log(`Character name: ${peopleResponse.name}`);
    console.log(peopleResponse);
    console.log(`mySwConnection.readyState = ${mySwConnection.readyState}`);
    if (mySwConnection.success)
        console.log('Success!');
}
fetchRandomStarWarsData();
const myRequestHeaders = [];
const myOptions = {
    url: 'https://api.covidtracking.com/v1/states/daily.json',
    method: 'GET',
    responseType: 'json',
    requestHeaders: myRequestHeaders,
    timeoutMs: 20000,
    debug: true,
    consoleMessage: 'My test connection finished, some details below.',
    onLoadEnd: onLoadEnd,
    onTimeout: onTimeout,
    onProgress: onProgress,
    onAbort: onAbort
};
const myConnection = new Oxhr(myOptions);
async function tryToSendData() {
    let response;
    const myData = `{ "test": 123 }`;
    try {
        console.log('try-block of tryToSendData');
        console.log(`XHR status of myConnection is ${myConnection.status}`);
        console.log('Now we will await myConnection.send');
        response = await myConnection.send(myData);
        console.log('await myConnection.send is DONE, all data received!');
        if (response && response.someFixedResponseData === 12345) {
            console.log('We got someFixedResponseData 12345');
        }
        else {
            console.log('HTML response OK, but someFixedResponseData not received.');
        }
    }
    catch (e) {
        if (!(e instanceof OxhrError))
            throw e;
        console.log(`Oxhr error message: ${e.message}`);
        console.log(e);
    }
    finally {
        console.log(`finally-block, XHR status of myConnection is ${myConnection.status}`);
    }
}
function onProgress(percent, bytes) {
    if (loadProgress)
        loadProgress.value = percent;
    if (loadBytes)
        loadBytes.innerText = bytes + ' bytes';
}
function onAbort() {
    console.log('demo: custom abort handler');
    alert('Connection aborted by user');
}
function onLoadEnd() {
    console.log(`demo: custom loadend handler, readyState = ${myConnection.readyState}`);
    console.log(`XHR status of myConnection is ${myConnection.status}`);
    if (myConnection.success) {
        alert('Success!');
    }
}
function onTimeout() {
    console.log('demo: custom timeout handler');
    alert('Connection time out!');
}
function handleStartButtonClick() {
    console.log(`start: handleStartButtonClick readyState = ${myConnection.readyState}`);
    if (loadProgress)
        loadProgress.value = 0;
    if (loadBytes)
        loadBytes.innerText = "0 bytes";
    tryToSendData();
    console.log('end: handleStartButtonClick');
}
function handleAbortButtonClick() {
    console.log('start: handleAbortButtonClick');
    myConnection.abort();
    console.log('end: handleAbortButtonClick');
}
if (startButton)
    startButton.addEventListener('click', handleStartButtonClick);
if (abortButton)
    abortButton.addEventListener('click', handleAbortButtonClick);
if (swButton)
    swButton.addEventListener('click', fetchRandomStarWarsData);
