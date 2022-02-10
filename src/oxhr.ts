/*
Oxhr, an object-oriented XHR (XMLHttpRequest) wrapper/library.
Copyright 2021-2022 Jan Prazak, https://github.com/Amarok24/Oxhr

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

import {OxhrError} from './oxhr-error.js';
import {XhrReadyState} from './xhr-ready-state.js';
import type {IOxhrParams, IResolve, IReject, HttpRequestMethod} from "./oxhr-types.js";

export {Oxhr};


type CombinedDataType = XMLHttpRequestBodyInit | Document | null;


class Oxhr<T = unknown>
{
  protected readonly _xhr: XMLHttpRequest = new XMLHttpRequest();
  protected _data: CombinedDataType;
  protected _eventHandlersAssigned: boolean = false;
  protected params: IOxhrParams;
  protected method: HttpRequestMethod;
  protected responseType: XMLHttpRequestResponseType;

  constructor(parameters: IOxhrParams)
  {
    this.params = parameters;
    this.method = parameters.method ?? 'GET';
    this._data = parameters.data ?? null;
    this.responseType = parameters.responseType ?? '';
    // Here this._xhr.readyState == 0
  }


  // Small tutorial: here 'httpExecutor' is an executor function, used as parameter for new Promise (constructor).
  // The executor function must accept two callable functions as parameters which are internally processed by a new Promise instance. Inside the executor function we only have to call resolve/reject functions manually depending on success/fail.

  private _httpExecutor = (resolve: IResolve<T>, reject: IReject): void =>
  {
    // httpExecutor must be an arrow function because AFs don't have own binding to 'this'.
    const handleLoad = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
    {
      this.debugMessage(`Oxhr: handleLoad(), status: ${ this._xhr.status }`);

      // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      if (this._xhr.status >= 200 && this._xhr.status < 300)
      {
        resolve(this._xhr.response);
        if (this.params.consoleInfo) console.group(this.params.consoleInfo);
        console.log(`${ ev.loaded } bytes loaded.`);
        if (this.params.consoleInfo) console.groupEnd();
      }
      else
      {
        // Here _xhr.response would usually (always?) be null.
        reject(
          // Reject with full response content to use later.
          new OxhrError(`HTML status code ${ this._xhr.status }`)
        );
      }
    };

    // Serious errors like timeout / unreachable URL / no internet connection.
    const handleError = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
    {
      this.debugMessage(`Oxhr: handleError()`);
      reject(new OxhrError('Failed to send request!'));
      if (this.params.consoleInfo) console.group(this.params.consoleInfo);
      console.log(ev);
      console.error(`xhr status: ${ this._xhr.status }`);
      if (this.params.consoleInfo) console.groupEnd();
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
      this.debugMessage('Oxhr: handleTimeout()');
      reject(new OxhrError('Timeout'));
    };

    const handleLoadEnd = (): void =>
    {
      this.debugMessage('Oxhr: handleLoadEnd(), removing event listeners and calling custom onLoadEnd (if provided)');

      // Only event listeners which call "resolve" or "reject" need to be re-set with every new "await ... send()", because closures are used (listeners are bound to the individual scope of _httpExecutor, which is a private method and gets re-called with every new "send" method). But for the sake of simplicity let's just remove all event listeners here.
      this._xhr.removeEventListener('load', handleLoad);
      this._xhr.removeEventListener('loadend', handleLoadEnd);
      this._xhr.removeEventListener('error', handleError);
      this._xhr.removeEventListener('progress', handleProgress);

      //if (this.params.onLoadEnd) this._xhr.removeEventListener('loadend', this.params.onLoadEnd);
      if (this.params.onAbort) this._xhr.removeEventListener('abort', this.params.onAbort);

      if (this.params.onTimeOut)
      {
        this._xhr.removeEventListener('timeout', this.params.onTimeOut);
      }
      else
      {
        this._xhr.removeEventListener('timeout', handleTimeout);
      }

      this.params.onLoadEnd?.();
      this._eventHandlersAssigned = false;
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
        if ((h.header !== '') && (h.value !== ''))
        {
          this.debugMessage(`Oxhr: setting custom request header '${ h.header }, ${ h.value }'`);
          this._xhr.setRequestHeader(h.header, h.value);
        }
      });
    }

    // Timeout on client side differs from server timeout. Default timeout is 0 (never).
    // If timeout > 0 specified then fetching data will be interrupted after given time
    // and the "timeout" event and "loadend" events will be triggered.
    this._xhr.timeout = this.params.timeoutMs ?? 60000;

    // If respType == "json" then XMLHttpRequest will perform JSON.parse().
    this._xhr.responseType = this.responseType;

    if (!this._eventHandlersAssigned)
    {
      this._eventHandlersAssigned = true;
      this.debugMessage('Oxhr: adding event listeners');

      // All XHR events: https://xhr.spec.whatwg.org/#events
      this._xhr.addEventListener('load', handleLoad);
      this._xhr.addEventListener('loadend', handleLoadEnd);
      this._xhr.addEventListener('error', handleError);
      this._xhr.addEventListener('progress', handleProgress);
      // More than 1 event of the same type on the same XHR instance does not work. Therefore custom onLoadEnd has to be called from handleLoadEnd.

      if (this.params.onAbort) this._xhr.addEventListener('abort', this.params.onAbort);

      if (this.params.onTimeOut)
      {
        this._xhr.addEventListener('timeout', this.params.onTimeOut);
      }
      else
      {
        this._xhr.addEventListener('timeout', handleTimeout);
      }
    }

    if (this._xhr.readyState !== XhrReadyState.OPENED)
    {
      // Only when readyState is opened it is possible to call 'send', else error will be thrown. It is now safe to define connection as running.
      this.debugMessage('Oxhr warning: connection not opened, this will cause an error.');
    }

    // The send() method is async by default, notification of a completed transaction is provided using event listeners.
    this._xhr.send(this._data);
  }; // END of _httpExecutor


  private debugMessage(m: string): void
  {
    if (this.params.debug) console.log(m);
  }


  get readyState(): XhrReadyState
  {
    return this._xhr.readyState;
  }


  get status(): XhrReadyState
  {
    return this._xhr.status;
  }


  send(data?: CombinedDataType): Promise<T> | never
  {
    this.debugMessage(`Oxhr: _xhr.readyState ${ this._xhr.readyState }`);
    if (this._xhr.readyState !== XhrReadyState.UNSENT)
    {
      throw new OxhrError('A violation occured, the same connection is already being processed or has already finished.');
    }

    this._data = data ?? this._data;

    // Send has to return type Promise to work correctly with 'await'.
    // "this._httpExecutor" will be called before the Promise gets returned.
    return new Promise<T>(this._httpExecutor);
  }


  abort(): void
  {
    if (this._xhr.readyState !== XhrReadyState.LOADING)
    {
      console.log('Oxhr: Cannot abort because no connection is running.');
      return;
    }
    console.log('Oxhr: Aborting connection...');
    this._xhr.abort();
  }

}
