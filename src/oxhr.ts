/*
Oxhr v1.0.1
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

import type { IXhrParams, IResolve, IReject } from "./oxhrtypes.js";

export { Oxhr };


class Oxhr<T = any>
{
	private readonly xhr: XMLHttpRequest = new XMLHttpRequest();
	private params: IXhrParams;
	private method: "get" | "post";
	private data: BodyInit | Document | null;
	private responseType: XMLHttpRequestResponseType;
	private connectionRunning: boolean = false;

	constructor(parameters: IXhrParams)
	{
		this.params = parameters;
		this.method = parameters.method ? parameters.method : "get";
		this.data = parameters.data ? parameters.data : null;
		this.responseType = parameters.responseType ? parameters.responseType : "";
	}

	// TODO: data parameter
	Send(): Promise<T> | never
	{
		if (this.connectionRunning)
		{
			throw { message: "A connection is already running." };
		}
		this.connectionRunning = true;
		// Send has to return type Promise to work correctly with 'await'.
		return new Promise<T>(this.HttpExecutor);
	}

	Abort(): void
	{
		if (!this.connectionRunning)
		{
			console.log("No connection to abort.");
			return;
		}
		console.log("Aborting connection...");
		this.xhr.abort();
		this.connectionRunning = false;
	}

	// Small tutorial: here 'HttpExecutor' is an executor function, used as parameter for new Promise (constructor). It should return void (return value not used anywhere).
	// The executor function must accept two callable functions as parameters which are  internally processed by the Promise object. Inside the executor function we only have to call resolve/reject functions manually depending on success/fail.

	protected HttpExecutor = (resolve: IResolve<T>, reject: IReject): void =>
	{
		// HttpExecutor must be an arrow function because AFs don't have own binding to 'this'.
		const HandleLoad = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			console.log("HandleLoad");
			// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
			if (this.xhr.status >= 200 && this.xhr.status < 300)
			{
				resolve(this.xhr.response);
				if (this.params.consoleInfo) console.group(this.params.consoleInfo);
				console.log(`${ev.loaded} bytes loaded.`);
				if (this.params.consoleInfo) console.groupEnd();
			}
			else
			{
				// Here xhr.response would usually (always?) be null.
				reject(
					// Reject with full response content to use later.
					new Error(`HTML status code ${this.xhr.status}`)
				);
			}

			this.connectionRunning = false;
		};

		const HandleError = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			// Serious errors like timeout / unreachable URL / no internet connection.
			reject(
				// Reject with full response content to use later.
				new Error("jXhr: failed to send request!")
			);
			if (this.params.consoleInfo) console.group(this.params.consoleInfo);
			console.log(ev);
			console.error(`xhr.status ${this.xhr.status}`);
			if (this.params.consoleInfo) console.groupEnd();

			this.connectionRunning = false;
		};

		const HandleProgress = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
		{
			if (ev.lengthComputable)
			{
				const percentComplete: number = ev.loaded / ev.total * 100;
				if (this.params.OnProgress) this.params.OnProgress(percentComplete, ev.loaded);

			}
			else
			{
				// If ev.total is unknown then it is set to 0 automatically.
				if (this.params.OnProgress) this.params.OnProgress(-1, ev.loaded);
			}
		};

		const HandleTimeout = (): void =>
		{
			// Notice that we don't "throw" an error here, this would be unhandled later.
			// Here xhr.status is 0.
			reject(new Error("TimeoutError"));

			this.connectionRunning = false;
		};

		// 'readystatechange' event reports every single event, usually not needed.
		/* const HandleReadyStateChange = (ev: Event): void =>
			{
				console.log("HandleReadyStateChange");
				console.log(ev);
			};
		 */

		this.xhr.open(this.method, this.params.url);

		if (this.params.requestHeaders)
		{
			this.params.requestHeaders.forEach((h) =>
			{
				if ((h.header !== "") && (h.value !== ""))
				{
					console.log(`Setting custom request header '${h.header}, ${h.value}'`);
					this.xhr.setRequestHeader(h.header, h.value);
				}
			});
		}

		// Timeout on client side differs from server timeout. Default timeout is 0 (never).
		// If timeout > 0 specified then fetching data will be interrupted after given time
		// and the "timeout" event and "loadend" events will be triggered.
		this.xhr.timeout = this.params.timeoutMs ? this.params.timeoutMs : 60000;

		this.xhr.responseType = this.responseType;
		// If respType is "json" then XMLHttpRequest will automatically do JSON.parse().

		// All XHR events: https://xhr.spec.whatwg.org/#events
		this.xhr.addEventListener("load", HandleLoad);
		this.xhr.addEventListener("error", HandleError);
		this.xhr.addEventListener("progress", HandleProgress);

		if (this.params.OnLoadEnd) this.xhr.addEventListener("loadend", this.params.OnLoadEnd);
		if (this.params.OnAbort) this.xhr.addEventListener("abort", this.params.OnAbort);
		//if (this.params.readystatechange) this.xhr.addEventListener("readystatechange", this.params.readystatechange);

		if (this.params.OnTimeOut)
		{
			this.xhr.addEventListener("timeout", this.params.OnTimeOut);
		}
		else
		{
			this.xhr.addEventListener("timeout", HandleTimeout);
		}

		// The send() method is async by default, notification of a completed transaction is provided using event listeners.
		this.xhr.send(this.data);
	};

}
