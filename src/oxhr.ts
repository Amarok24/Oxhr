/*
Oxhr v1.0.3
An object-oriented XHR (XMLHttpRequest) wrapper/library.
Copyright 2021 Jan Prazak, https://github.com/Amarok24/Oxhr

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { IOxhrParams, IResolve, IReject } from "./oxhr_types.js";

export { Oxhr };


type CombinedDataType = BodyInit | Document | null;


class Oxhr<T = any>
{
	private readonly _xhr: XMLHttpRequest = new XMLHttpRequest();
	private _data: CombinedDataType;
	protected params: IOxhrParams;
	protected method: "get" | "post";
	protected responseType: XMLHttpRequestResponseType;
	protected connectionRunning: boolean = false;

	constructor(parameters: IOxhrParams)
	{
		this.params = parameters;
		this.method = parameters.method ?? "get";
		this._data = parameters.data ?? null;
		this.responseType = parameters.responseType ?? "";
	}

	send(data?: CombinedDataType): Promise<T> | never
	{
		if (this.connectionRunning)
		{
			throw { message: "A connection is already running." };
		}

		this._data = data ?? this._data;

		this.connectionRunning = true;
		// Send has to return type Promise to work correctly with 'await'.
		return new Promise<T>(this.httpExecutor);
	}

	abort(): void
	{
		if (!this.connectionRunning)
		{
			console.log("No connection to abort.");
			return;
		}
		console.log("Aborting connection...");
		this._xhr.abort();
		this.connectionRunning = false;
	}

	// Small tutorial: here 'httpExecutor' is an executor function, used as parameter for new Promise (constructor). It should return void (return value not used anywhere).
	// The executor function must accept two callable functions as parameters which are  internally processed by the Promise object. Inside the executor function we only have to call resolve/reject functions manually depending on success/fail.

	protected httpExecutor = (resolve: IResolve<T>, reject: IReject): void =>
	{
		// httpExecutor must be an arrow function because AFs don't have own binding to 'this'.
		const handleLoad = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			console.log("handleLoad");
			// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
			if (this._xhr.status >= 200 && this._xhr.status < 300)
			{
				resolve(this._xhr.response);
				if (this.params.consoleInfo) console.group(this.params.consoleInfo);
				console.log(`${ev.loaded} bytes loaded.`);
				if (this.params.consoleInfo) console.groupEnd();
			}
			else
			{
				// Here _xhr.response would usually (always?) be null.
				reject(
					// Reject with full response content to use later.
					new Error(`HTML status code ${this._xhr.status}`)
				);
			}

			this.connectionRunning = false;
		};

		const handleError = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			// Serious errors like timeout / unreachable URL / no internet connection.
			reject(
				// Reject with full response content to use later.
				new Error("Oxhr: failed to send request!")
			);
			if (this.params.consoleInfo) console.group(this.params.consoleInfo);
			console.log(ev);
			console.error(`xhr status: ${this._xhr.status}`);
			if (this.params.consoleInfo) console.groupEnd();

			this.connectionRunning = false;
		};

		const handleProgress = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			if (ev.lengthComputable)
			{
				const percentComplete: number = ev.loaded / ev.total * 100;
				if (this.params.onProgress) this.params.onProgress(percentComplete, ev.loaded);

			}
			else
			{
				// If ev.total is unknown then it is set to 0 automatically.
				if (this.params.onProgress) this.params.onProgress(-1, ev.loaded);
			}
		};

		const handleTimeout = (): void =>
		{
			// Notice that we don't "throw" an error here, this would be unhandled later.
			// Here _xhr.status is 0.
			reject(new Error("TimeoutError"));

			this.connectionRunning = false;
		};

		// 'readystatechange' event reports every single event, usually not needed.
		// const handleReadyStateChange = (ev: Event): void =>
		// {
		//  console.log("handleReadyStateChange");
		//  console.log(ev);
		// };

		this._xhr.open(this.method, this.params.url);

		if (this.params.requestHeaders)
		{
			this.params.requestHeaders.forEach((h) =>
			{
				if ((h.header !== "") && (h.value !== ""))
				{
					console.log(`Setting custom request header '${h.header}, ${h.value}'`);
					this._xhr.setRequestHeader(h.header, h.value);
				}
			});
		}

		// Timeout on client side differs from server timeout. Default timeout is 0 (never).
		// If timeout > 0 specified then fetching data will be interrupted after given time
		// and the "timeout" event and "loadend" events will be triggered.
		this._xhr.timeout = this.params.timeoutMs ?? 60000;

		this._xhr.responseType = this.responseType;
		// If respType is "json" then XMLHttpRequest will automatically do JSON.parse().

		// All XHR events: https://xhr.spec.whatwg.org/#events
		this._xhr.addEventListener("load", handleLoad);
		this._xhr.addEventListener("error", handleError);
		this._xhr.addEventListener("progress", handleProgress);

		if (this.params.onLoadEnd) this._xhr.addEventListener("loadend", this.params.onLoadEnd);
		if (this.params.onAbort) this._xhr.addEventListener("abort", this.params.onAbort);

		if (this.params.onTimeOut)
		{
			this._xhr.addEventListener("timeout", this.params.onTimeOut);
		}
		else
		{
			this._xhr.addEventListener("timeout", handleTimeout);
		}

		// The send() method is async by default, notification of a completed transaction is provided using event listeners.
		this._xhr.send(this._data);
	};

}
