export enum XhrReadyState
{
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
  UNSENT = 0, // Client has been created. open() not called yet.
  OPENED, // open() has been called.
  HEADERS_RECEIVED, // send() has been called, and headers and status are available.
  LOADING, // Downloading; responseText holds partial data.
  DONE // The operation is complete.
}
