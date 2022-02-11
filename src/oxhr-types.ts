/*
Oxhr, an object-oriented XHR (XMLHttpRequest) wrapper/library.
Copyright 2021-2022 Jan Prazak, https://github.com/Amarok24/Oxhr
Licensed under the Apache License, Version 2.0
*/

export type {
  IOxhrParams,
  IResolve,
  IReject,
  IRequestHeader,
  HttpRequestMethod,
  CombinedDataType
};

/**
 * Parameters for Oxhr.
 * @param url "URL" for request. The only mandatory parameter.
 * @param method Default: GET. https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * @param data Data to send with request. Supports all valid data types. Default: null.
 * @param responseType A valid response type. Default: "".
 * @param requestHeaders Custom HTTP headers. Array of IRequestHeader.
 * @param timeoutMs Timeout in milliseconds after which connection will be interrupted.
 * @param consoleInfo Description of console.group for console output.
 * @param debug Output additional info to the browser console (debug mode).
 * @param onLoadEnd Called after load success, timeout, abort or error.
 * @param onProgress Callback function to which the loading progress in % shall be passed.
 * @param onTimeOut Callback function for timeout.
 * @param onAbort Callback function when an open connection is aborted.
 */
interface IOxhrParams
{
  url: string;
  method?: HttpRequestMethod;
  responseType?: XMLHttpRequestResponseType;
  data?: CombinedDataType;
  requestHeaders?: IRequestHeader[];
  timeoutMs?: number;
  consoleInfo?: string;
  debug?: boolean;
  onLoadEnd?: () => void;
  onProgress?: (percent: number, bytes: number) => void;
  onTimeOut?: () => void;
  onAbort?: () => void;
}

type HttpRequestMethod = 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

type CombinedDataType = XMLHttpRequestBodyInit | Document | null;

interface IRequestHeader
{
  header: string;
  value: string;
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
