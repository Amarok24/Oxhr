import * as jxhr from "./jxhr.ts";

const startButton = document.querySelector<HTMLButtonElement>("#startButton");
const abortButton = document.querySelector<HTMLButtonElement>("#abortButton");
const loadProgress = document.querySelector<HTMLProgressElement>("#loadProgress");
const loadBytes = document.querySelector<HTMLElement>("#loadBytes");

// 'pointerToXhr' only needed for possibility to cancel (abort) data transfer by user.
let pointerToXhr: XMLHttpRequest | null = null;


interface IJsonResponse
{
	status: number;
}


async function TryToSendData(): Promise<void>
{
	let response: IJsonResponse;

	const myRequestHeaders: jxhr.IRequestHeader[] = [
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

	const xhrOptions: jxhr.IXhrParameters = {
		method: "get",
		url: "https://api.covidtracking.com/v1/states/daily.json", // "https://webhook.site/4542eb6f-60f6-4643-b6df-af56e24bed1e"
		data: "my test",
		respType: "json",
		reqHeaders: myRequestHeaders,
		timeoutMs: 2000,
		loadend: OnLoadEnd,
		//timeout: OnTimeOut,
		progress: OnProgress,
		abort: OnAbort,
		xhrReference: ObtainXhrReference,
		consoleInfo: "Connecting...",
	};
	/*
		myRequestHeaders.push({
			header: "x-csrf-token",
			value: token
		});
	 */


	try
	{
		response = await jxhr.SendXhrData<IJsonResponse>(xhrOptions);

		if (response && response.status === 200)
		{
			console.log("JSON response with 200, good! JSON below.");
		}
		else
		{
			console.log("HTML response OK, but JSON response.status not 200. JSON below.");
		}

		//console.log(response);

	}
	catch (err)
	{
		// 'error' is the new Error message from reject(new Error) lines in jXhr.ts
		console.log(`An error occured, but we handled it. Error message: ${err.message}`);
	}
}


function OnProgress(percent: number, bytes: number): void
{
	// Very often the total filesize is not known, in such a case percent will be -1
	if (loadProgress) loadProgress.value = percent;
	if (loadBytes) loadBytes.innerText = bytes + " bytes";
}


function OnAbort(): void
{
	console.log("OnAbort called!");
}

function OnLoadEnd(): void
{
	console.log("OnLoadEnd called!");
}

function OnTimeOut(): void
{
	console.log("OnTimeOut called!");
}

function OnStartButtonClick()
{
	console.log("start OnStartButtonClick");
	TryToSendData();
	console.log("end OnStartButtonClick");
}

function ObtainXhrReference(ref: XMLHttpRequest): void
{
	pointerToXhr = ref;
}


function OnAbortButtonClick()
{
	console.log("start OnAbortButtonClick");
	if (pointerToXhr) pointerToXhr.abort();
	console.log("end OnAbortButtonClick");
}



if (startButton) startButton.addEventListener("click", OnStartButtonClick);
if (abortButton) abortButton.addEventListener("click", OnAbortButtonClick);
