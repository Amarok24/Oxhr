export var XhrReadyState;
(function (XhrReadyState) {
    XhrReadyState[XhrReadyState["UNSENT"] = 0] = "UNSENT";
    XhrReadyState[XhrReadyState["OPENED"] = 1] = "OPENED";
    XhrReadyState[XhrReadyState["HEADERS_RECEIVED"] = 2] = "HEADERS_RECEIVED";
    XhrReadyState[XhrReadyState["LOADING"] = 3] = "LOADING";
    XhrReadyState[XhrReadyState["DONE"] = 4] = "DONE";
})(XhrReadyState || (XhrReadyState = {}));
export var XhrStatus;
(function (XhrStatus) {
    XhrStatus[XhrStatus["UNSENT"] = 0] = "UNSENT";
    XhrStatus[XhrStatus["CONTINUE"] = 100] = "CONTINUE";
    XhrStatus[XhrStatus["OK"] = 200] = "OK";
    XhrStatus[XhrStatus["LOADING"] = 200] = "LOADING";
    XhrStatus[XhrStatus["MULTIPLE_CHOICE"] = 300] = "MULTIPLE_CHOICE";
    XhrStatus[XhrStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    XhrStatus[XhrStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    XhrStatus[XhrStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    XhrStatus[XhrStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    XhrStatus[XhrStatus["NOT_ALLOWED"] = 405] = "NOT_ALLOWED";
    XhrStatus[XhrStatus["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    XhrStatus[XhrStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    XhrStatus[XhrStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    XhrStatus[XhrStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    XhrStatus[XhrStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(XhrStatus || (XhrStatus = {}));
