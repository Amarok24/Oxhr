// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
export enum XhrReadyState
{
  UNSENT = 0, // Client has been created. open() not called yet.
  OPENED, // open() has been called.
  HEADERS_RECEIVED, // send() has been called, and headers and status are available.
  LOADING, // Downloading; responseText holds partial data.
  DONE // The operation is complete.
}


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export enum XhrStatus
{
  UNSENT = 0, // basically means "not started"
  CONTINUE = 100,
  OK = 200,
  LOADING = 200, // LOADING uses the same code as OK
  MULTIPLE_CHOICE = 300,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503
}
