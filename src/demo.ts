/*
Demo of Oxhr, an object-oriented and asynchronous XMLHttpRequest library.
https://github.com/Amarok24/Oxhr
*/

import {Oxhr} from './oxhr.js';
import {OxhrError} from './oxhr-error.js';
import {IPeople, ResourcesType} from './swapi-schema.js';
import type {IOxhrParams, IRequestHeader} from './oxhr-types.js';

const startButton = document.querySelector<HTMLButtonElement>('#startButton');
const abortButton = document.querySelector<HTMLButtonElement>('#abortButton');
const swButton = document.querySelector<HTMLButtonElement>('#swButton');
const loadProgress = document.querySelector<HTMLProgressElement>('#loadProgress');
const loadBytes = document.querySelector<HTMLElement>('#loadBytes');


// -=-=-= A VERY BASIC USAGE EXAMPLE =-=-=-
// Call FetchRandomStarWarsData() as many times as you want to fetch another random StarWars character ("people" API) in parallel, because this is an async function where new instances of Oxhr are created.

async function fetchRandomStarWarsData(): Promise<void>
{
  let peopleResponse: IPeople;
  const random: number = Math.floor(Math.random() * 10 + 1);
  const swOptions: IOxhrParams = {
    // I also recommend this free API for testing: https://webhook.site/
    url: `https://swapi.dev/api/${ ResourcesType.People }/${ random }`,
    consoleMessage: 'StarWars connection finished, some details below.',
    onLoadEnd: () =>
    {
      console.info('Opening browser pop-up message with character data...');
      alert(JSON.stringify(peopleResponse));
    },
    // The response of SW-API is in JSON, so we want automatic JSON.parse()
    responseType: 'json',
    debug: false
  };
  const mySwConnection = new Oxhr<IPeople>(swOptions);

  console.log(`mySWConnection.instanceId = ${ mySwConnection.instanceId }`);
  peopleResponse = await mySwConnection.send();
  console.log(`Character name: ${ peopleResponse.name }`);
  console.log(peopleResponse);
  console.log(`mySwConnection.readyState = ${ mySwConnection.readyState }`);
  if (mySwConnection.success) console.log('Success!');
}


fetchRandomStarWarsData();


// -=-=-= A MORE ADVANCED USAGE EXAMPLE =-=-=-
// You may want to set network throttling to slow 3G or fast 3G in order to try out the Abort button.

const myRequestHeaders: IRequestHeader[] = [
  /*
    {
      header: "Accept",
      value: "application/json" // Necessary for some servers.
    },
    {
      header: "Content-Type",
      value: "application/json" // Necessary for some servers.
    },
  */
];

const myOptions: IOxhrParams = {
  // Attention, daily.json is quite large, 29 Mb
  url: 'https://api.covidtracking.com/v1/states/daily.json',
  // url: 'https://webhook.site/4542eb6f-60f6-4643-b6df-af56e24bed1e',
  method: 'GET',
  responseType: 'json',
  // data: `{ "test": 123 }`, -- Data may be passed before calling the 'send' method.
  requestHeaders: myRequestHeaders,
  timeoutMs: 20000,
  debug: true,
  consoleMessage: 'My test connection finished, some details below.',
  onLoadEnd: onLoadEnd,
  onTimeout: onTimeout,
  onProgress: onProgress,
  onAbort: onAbort
};

interface IJsonResponse
{ // just for demo purposes, no meaning
  someFixedResponseData: number;
}

const myConnection = new Oxhr<IJsonResponse>(myOptions);


// This function re-uses the same instance of Oxhr. Try to start the function multiple times when a connection is already running.
async function tryToSendData(): Promise<void>
{
  let response: IJsonResponse;
  const myData = `{ "test": 123 }`;

  try
  {
    console.log('try-block of tryToSendData');
    console.log(`XHR status of myConnection is ${ myConnection.status }`);
/* 
    if (myConnection.isProcessed)
    {
      console.log('You have clicked on the button while a connection is being processed.');
      return;
    }
 */
    console.log('Now we will await myConnection.send');
    // In this example we pass the data to be sent with request with the 'send' method.
    response = await myConnection.send(myData);
    console.log('await myConnection.send is DONE, all data received!');

    if (response && response.someFixedResponseData === 12345)
    {
      // You won't get this response, of course, that's just an example.
      console.log('We got someFixedResponseData 12345');
    }
    else
    {
      console.log('HTML response OK, but someFixedResponseData not received.');
    }

    // Attention, daily.json is quite large, 29 Mb
    // console.log(response);
  }
  catch (e: unknown)
  {
    if (!(e instanceof OxhrError)) throw e;
    console.log(`Oxhr error message: ${ e.message }`);
    console.log(e);
  }
  finally
  {
    console.log(`finally-block, XHR status of myConnection is ${ myConnection.status }`);
  }
}


function onProgress(percent: number, bytes: number): void
{
  // Often the total filesize is not known, in such a case percent will be -1
  if (loadProgress) loadProgress.value = percent;
  if (loadBytes) loadBytes.innerText = bytes + ' bytes';
}

function onAbort(): void
{
  console.log('demo: custom abort handler');
  alert('Connection aborted by user');
}

function onLoadEnd(): void
{
  console.log(`demo: custom loadend handler, readyState = ${ myConnection.readyState }`);
  console.log(`XHR status of myConnection is ${ myConnection.status }`);

  if (myConnection.success)
  {
    alert('Success!');
  }
}

function onTimeout(): void
{
  console.log('demo: custom timeout handler');
  alert('Connection time out!');
}

function handleStartButtonClick()
{
  console.log(`start: handleStartButtonClick readyState = ${ myConnection.readyState }`);
  if (loadProgress) loadProgress.value = 0;
  if (loadBytes) loadBytes.innerText = "0 bytes";

  tryToSendData();

  console.log('end: handleStartButtonClick');
}

function handleAbortButtonClick()
{
  console.log('start: handleAbortButtonClick');
  myConnection.abort();
  console.log('end: handleAbortButtonClick');
}


if (startButton) startButton.addEventListener('click', handleStartButtonClick);
if (abortButton) abortButton.addEventListener('click', handleAbortButtonClick);
if (swButton) swButton.addEventListener('click', fetchRandomStarWarsData);
