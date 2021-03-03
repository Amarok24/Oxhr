/*
jXhr v1.32
Promise-based asynchronous XMLHttpRequest (XHR) library. [JS Module]
Copyright 2021 Jan Prazak, https://github.com/Amarok24/
Licensed under the Apache License, Version 2.0
*/

export { SendXhrData };
export type { IXhrParameters, IRequestHeader };

interface IRequestHeader
{
	header: string;
	value: string;
}

/**
 *	Parameters for SendXhrData.
 *	@param method "get" or "post".
 *	@param url "URL" for request.
 *	@param data Data to send with request.
 *	@param respType A valid response type (see XMLHttpRequestResponseType).
 *	@param reqHeaders Optional array of IRequestHeader.
 *	@param consoleInfo Description of console.group for console output.
 *	@param timeout Timeout in milliseconds after which connection should be interrupted.
 *	@param loadend Callback function for 'loadend'. Recommended if 'timeout' is defined.
 *	@param progress Callback function to which the loading progress in % shall be passed.
 *	@param abort Callback function for 'abort'. Will be triggered after calling .abort()
 *	@param xhrReference Callback function to which reference of new xhr object shall be passed as parameter. User can then call .abort() on this parameter to cancel transfer.
 */
interface IXhrParameters
{
	method: "get" | "post";
	url: string;
	data: Document | BodyInit | null;
	respType: XMLHttpRequestResponseType;
	reqHeaders?: IRequestHeader[];
	timeout?: number;
	consoleInfo?: string;
	loadend?: () => void;
	progress?: (percent: number, bytes: number) => void;
	abort?: () => void;
	xhrReference?: (ref: XMLHttpRequest) => void;
}


const defaults = {
	timeout: 600000 // 60 seconds
}

interface IResolve<R>
{
	// Must be a function which takes one parameter of type <R> and returns nothing.
	(value: R | PromiseLike<R>): void;
	//(value: R): void;
}

interface IReject
{
	// Must be a function which takes one parameter of type Error and returns nothing.
	(value: Error): void;
}

function SendXhrData<T>(params: IXhrParameters): Promise<T>
{
	// Small tutorial: here 'HttpExecutor' is an executor function, used as parameter for new Promise (constructor). It should return void (return value not used anywhere).
	// The executor function must accept two callable functions as parameters which are  internally processed by the Promise object. Inside the executor function we only have to call resolve/reject functions manually depending on success/fail.

	const HttpExecutor = (resolve: IResolve<T>, reject: IReject): void =>
	{
		const xhr: XMLHttpRequest = new XMLHttpRequest();

		const HandleLoad = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			console.log("HandleLoad");
			// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
			if (xhr.status >= 200 && xhr.status < 300)
			{
				resolve(xhr.response);
				if (params.consoleInfo) console.group(params.consoleInfo);
				console.log(`${ev.loaded} bytes loaded.`);
				if (params.consoleInfo) console.groupEnd();
			}
			else
			{
				// Here xhr.response would usually (always?) be null.
				reject(
					// Reject with full response content to use later.
					new Error(`HTML status code ${xhr.status}`)
				);
			}
		};

		const HandleError = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			// Serious errors like timeout / unreachable URL / no internet connection.
			reject(
				// Reject with full response content to use later.
				new Error("jXhr: failed to send request!")
			);
			if (params.consoleInfo) console.group(params.consoleInfo);
			console.log(ev);
			console.error(`xhr.status ${xhr.status}`);
			if (params.consoleInfo) console.groupEnd();
		};

		const HandleProgress = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			if (ev.lengthComputable)
			{
				const percentComplete: number = ev.loaded / ev.total * 100;
				if (params.progress) params.progress(percentComplete, ev.loaded);

			}
			else
			{
				// If ev.total is unknown then it is set to 0 automatically.
				if (params.progress) params.progress(-1, ev.loaded);
			}
		};

		xhr.open(params.method, params.url);

		if (params.reqHeaders)
		{
			params.reqHeaders.forEach((h) =>
			{
				if ((h.header !== "") && (h.value !== ""))
				{
					console.log(`Setting custom request header '${h.header}, ${h.value}'`);
					xhr.setRequestHeader(h.header, h.value);
				}
			});
		}

		// Timeout on client side differs from server timeout. Default timeout is 0 (never).
		// If timeout > 0 specified then fetching data will be interrupted after given time
		// and the "loadend" event will be triggered (but _not_ load!). No error whatsoever.
		xhr.timeout = params.timeout ? params.timeout : defaults.timeout;

		xhr.responseType = params.respType;
		// If respType is "json" then XMLHttpRequest will automatically do JSON.parse().

		// All XHR events: loadstart, load, loadend, progress, error, abort.
		xhr.addEventListener("load", HandleLoad);
		xhr.addEventListener("error", HandleError);
		xhr.addEventListener("progress", HandleProgress);

		if (params.loadend) xhr.addEventListener("loadend", params.loadend);
		if (params.abort) xhr.addEventListener("abort", params.abort);

		// The send() method is async by default, notification of a completed transaction is provided using event listeners.
		xhr.send(params.data);

		if (params.xhrReference) params.xhrReference(xhr);
	};

	// SendXhrData has to return type Promise to work correctly with 'await'.
	return new Promise<T>(HttpExecutor);
}
