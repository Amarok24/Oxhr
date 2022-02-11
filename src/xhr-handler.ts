/*
Oxhr, an object-oriented XHR (XMLHttpRequest) wrapper/library.
Copyright 2021-2022 Jan Prazak, https://github.com/Amarok24/Oxhr
Licensed under the Apache License, Version 2.0
*/

import {OxhrError} from './oxhr-error.js';
import {XhrReadyState, XhrStatus} from './xhr-codes.js';
import {generateUUID} from './generate-uuid.js';

import type {IResolve, IReject, IOxhrParams, HttpRequestMethod, CombinedDataType} from "./oxhr-types.js";

export {XhrHandler};


class XhrHandler<T>
{
  private _eventHandlersAssigned: boolean = false;
  private _instanceId: string = generateUUID();
  protected readonly xhr: XMLHttpRequest = new XMLHttpRequest();
  protected data: CombinedDataType;
  protected params: IOxhrParams;
  protected method: HttpRequestMethod;
  protected responseType: XMLHttpRequestResponseType;

  constructor(parameters: IOxhrParams)
  {
    this.params = parameters;
    this.method = parameters.method ?? 'GET';
    this.data = parameters.data ?? null;
    this.responseType = parameters.responseType ?? '';
    this.debugMessage('A new instance was created.');
    // Here this.xhr.readyState == 0
  }

  // Small tutorial: xhrExecutor is an executor function, used as parameter for new Promise (constructor). The executor function must accept two callable functions as parameters which are internally processed by a new Promise instance. Inside the executor function we only have to call resolve/reject functions manually depending on success/fail.
  protected xhrExecutor = (resolve: IResolve<T>, reject: IReject): void =>
  {
    // httpExecutor must be an arrow function because AFs don't have own binding to 'this'.
    const handleLoad = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
    {
      this.debugMessage(`handleLoad(), status: ${ this.xhr.status }`);

      // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      if (
        this.xhr.status >= XhrStatus.LOADING &&
        this.xhr.status < XhrStatus.MULTIPLE_CHOICE)
      {
        resolve(this.xhr.response);
        if (this.params.consoleMessage) console.group(this.params.consoleMessage);
        console.log(`${ ev.loaded } bytes loaded.`);
        if (this.params.consoleMessage) console.groupEnd();
      }
      else
      {
        // Here xhr.response would usually (always?) be null.
        reject(
          // Reject with full response content to use later.
          new OxhrError(`XHR status code ${ this.xhr.status }`)
        );
      }
    };

    // Serious errors like timeout / unreachable URL / no internet connection.
    const handleError = (ev: ProgressEvent<XMLHttpRequestEventTarget>): void =>
    {
      this.debugMessage(`handleError()`);
      reject(new OxhrError('Failed to send request!'));
      if (this.params.consoleMessage) console.group(this.params.consoleMessage);
      console.log(ev);
      console.warn(`xhr status: ${ this.xhr.status }`);
      if (this.params.consoleMessage) console.groupEnd();
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
        // If ev.total is unknown then it is set automatically to 0.
        if (this.params.onProgress) this.params.onProgress(-1, ev.loaded);
      }
    };

    const handleTimeout = (): void =>
    {
      // Notice that we don't "throw" an error here, this would be unhandled later. Note: xhr.status is 0.
      this.debugMessage('handleTimeout()');
      reject(new OxhrError('Timeout'));
    };

    const handleLoadEnd = (): void =>
    {
      this.debugMessage('handleLoadEnd(), removing event listeners and calling custom onLoadEnd (if provided)');

      // Only event listeners which call "resolve" or "reject" need to be re-set with every new "await ... send()", because closures are used (listeners are bound to the individual scope of xhrExecutor, which is a private method and gets re-called with every new "send" method). But for the sake of simplicity let's just remove all event listeners here.
      this.xhr.removeEventListener('load', handleLoad);
      this.xhr.removeEventListener('loadend', handleLoadEnd);
      this.xhr.removeEventListener('error', handleError);
      this.xhr.removeEventListener('progress', handleProgress);

      //if (this.params.onLoadEnd) this.xhr.removeEventListener('loadend', this.params.onLoadEnd);
      if (this.params.onAbort) this.xhr.removeEventListener('abort', this.params.onAbort);

      if (this.params.onTimeout)
      {
        this.xhr.removeEventListener('timeout', this.params.onTimeout);
      }
      else
      {
        this.xhr.removeEventListener('timeout', handleTimeout);
      }

      this.params.onLoadEnd?.();
      this._eventHandlersAssigned = false;
    };

    // Calling the "open" method for an already active request (one for which open() has already been called) is the equivalent of calling abort().
    this.xhr.open(this.method, this.params.url);

    if (this.params.requestHeaders)
    {
      this.params.requestHeaders.forEach((h) =>
      {
        if ((h.header !== '') && (h.value !== ''))
        {
          this.debugMessage(`Setting custom request header '${ h.header }, ${ h.value }'`);
          this.xhr.setRequestHeader(h.header, h.value);
        }
      });
    }

    // Timeout on client side differs from server timeout. Default timeout is 0 (never).
    // If timeout > 0 specified then fetching data will be interrupted after given time and the "timeout" event and "loadend" events will be triggered.
    this.xhr.timeout = this.params.timeoutMs ?? 0;

    // If respType == "json" then XMLHttpRequest will perform JSON.parse().
    this.xhr.responseType = this.responseType;

    if (!this._eventHandlersAssigned)
    {
      this._eventHandlersAssigned = true;
      this.debugMessage('Adding event listeners.');

      // All XHR events: https://xhr.spec.whatwg.org/#events
      this.xhr.addEventListener('load', handleLoad);
      this.xhr.addEventListener('loadend', handleLoadEnd);
      this.xhr.addEventListener('error', handleError);
      this.xhr.addEventListener('progress', handleProgress);
      // More than 1 event of the same type on the same XHR instance does not work. Therefore custom onLoadEnd has to be called from handleLoadEnd.

      if (this.params.onAbort) this.xhr.addEventListener('abort', this.params.onAbort);

      if (this.params.onTimeout)
      {
        this.xhr.addEventListener('timeout', this.params.onTimeout);
      }
      else
      {
        this.xhr.addEventListener('timeout', handleTimeout);
      }
    }

    if (this.xhr.readyState !== XhrReadyState.OPENED)
    {
      // Only when readyState is opened it is possible to call 'send', else error will be thrown. It is now safe to define connection as running.
      this.debugMessage('Warning, connection not opened, this will cause an error.');
    }

    // The send() method is async by default, notification of a completed transaction is provided using event listeners.
    this.xhr.send(this.data);
  }; // END of xhrExecutor


  protected debugMessage(m: string): void
  {
    if (this.params.debug) console.info(`Oxhr: ${ m }\nInstance UUID ${ this._instanceId }`);
  }

  /**
   * Returns the XHR readyState code.
   */
  get readyState(): number
  {
    return this.xhr.readyState;
  }

  /**
   * Returns the XHR status code.
   */
  get status(): number
  {
    return this.xhr.status;
  }

  /**
   * Returns true if transfer was successful, which means XHR readyState is DONE and XHR status is OK.
   */
  get success(): boolean
  {
    return (
      this.xhr.readyState === XhrReadyState.DONE &&
      this.xhr.status === XhrStatus.OK
    );
  }

  /**
   * Returns true if a request is currently being processed.
   * You may want to use it to avoid execution of a second await-Promise task on the same Oxhr instance.
   */
  get isProcessed(): boolean
  {
    return (
      this.xhr.readyState !== XhrReadyState.DONE &&
      this.xhr.readyState !== XhrReadyState.UNSENT
    );
  }

  /**
   * Returns a unique instance UUID.
   */
  get instanceId(): string
  {
    return this._instanceId;
  }
}

// TODO: implement event handlers for processing uploads
// https://javascript.info/xmlhttprequest#upload-progress
