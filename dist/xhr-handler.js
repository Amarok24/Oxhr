import { OxhrError } from './oxhr-error.js';
import { XhrReadyState, XhrStatus } from './xhr-codes.js';
import { generateUUID } from './generate-uuid.js';
export { XhrHandler };
class XhrHandler {
    constructor(parameters) {
        this._eventHandlersAssigned = false;
        this._instanceId = generateUUID();
        this.xhr = new XMLHttpRequest();
        this.xhrExecutor = (resolve, reject) => {
            const handleLoad = (ev) => {
                this.debugMessage(`handleLoad(), status: ${this.xhr.status}`);
                if (this.xhr.status >= XhrStatus.LOADING &&
                    this.xhr.status < XhrStatus.MULTIPLE_CHOICE) {
                    resolve(this.xhr.response);
                    if (this.params.consoleMessage)
                        console.group(this.params.consoleMessage);
                    console.log(`${ev.loaded} bytes loaded.`);
                    if (this.params.consoleMessage)
                        console.groupEnd();
                }
                else {
                    reject(new OxhrError(`XHR status code ${this.xhr.status}`));
                }
            };
            const handleError = (ev) => {
                this.debugMessage(`handleError()`);
                reject(new OxhrError('Failed to send request!'));
                if (this.params.consoleMessage)
                    console.group(this.params.consoleMessage);
                console.log(ev);
                console.warn(`xhr status: ${this.xhr.status}`);
                if (this.params.consoleMessage)
                    console.groupEnd();
            };
            const handleProgress = (ev) => {
                if (ev.lengthComputable) {
                    const percentComplete = ev.loaded / ev.total * 100;
                    if (this.params.onProgress)
                        this.params.onProgress(percentComplete, ev.loaded);
                }
                else {
                    if (this.params.onProgress)
                        this.params.onProgress(-1, ev.loaded);
                }
            };
            const handleTimeout = () => {
                this.debugMessage('handleTimeout()');
                reject(new OxhrError('Timeout'));
            };
            const handleLoadEnd = () => {
                this.debugMessage('handleLoadEnd(), removing event listeners and calling custom onLoadEnd (if provided)');
                this.xhr.removeEventListener('load', handleLoad);
                this.xhr.removeEventListener('loadend', handleLoadEnd);
                this.xhr.removeEventListener('error', handleError);
                this.xhr.removeEventListener('progress', handleProgress);
                if (this.params.onAbort)
                    this.xhr.removeEventListener('abort', this.params.onAbort);
                if (this.params.onTimeout) {
                    this.xhr.removeEventListener('timeout', this.params.onTimeout);
                }
                else {
                    this.xhr.removeEventListener('timeout', handleTimeout);
                }
                this.params.onLoadEnd?.();
                this._eventHandlersAssigned = false;
            };
            this.xhr.open(this.method, this.params.url);
            if (this.params.requestHeaders) {
                this.params.requestHeaders.forEach((h) => {
                    if ((h.header !== '') && (h.value !== '')) {
                        this.debugMessage(`Setting custom request header '${h.header}, ${h.value}'`);
                        this.xhr.setRequestHeader(h.header, h.value);
                    }
                });
            }
            this.xhr.timeout = this.params.timeoutMs ?? 0;
            this.xhr.responseType = this.responseType;
            if (!this._eventHandlersAssigned) {
                this._eventHandlersAssigned = true;
                this.debugMessage('Adding event listeners.');
                this.xhr.addEventListener('load', handleLoad);
                this.xhr.addEventListener('loadend', handleLoadEnd);
                this.xhr.addEventListener('error', handleError);
                this.xhr.addEventListener('progress', handleProgress);
                if (this.params.onAbort)
                    this.xhr.addEventListener('abort', this.params.onAbort);
                if (this.params.onTimeout) {
                    this.xhr.addEventListener('timeout', this.params.onTimeout);
                }
                else {
                    this.xhr.addEventListener('timeout', handleTimeout);
                }
            }
            if (this.xhr.readyState !== XhrReadyState.OPENED) {
                this.debugMessage('Warning, connection not opened, this will cause an error.');
            }
            this.xhr.send(this.data);
        };
        this.params = parameters;
        this.method = parameters.method ?? 'GET';
        this.data = parameters.data ?? null;
        this.responseType = parameters.responseType ?? '';
        this.debugMessage('A new instance was created.');
    }
    debugMessage(m) {
        if (this.params.debug)
            console.info(`Oxhr: ${m}\nInstance UUID ${this._instanceId}`);
    }
    get readyState() {
        return this.xhr.readyState;
    }
    get status() {
        return this.xhr.status;
    }
    get success() {
        return (this.xhr.readyState === XhrReadyState.DONE &&
            this.xhr.status === XhrStatus.OK);
    }
    get isProcessed() {
        return (this.xhr.readyState !== XhrReadyState.DONE &&
            this.xhr.readyState !== XhrReadyState.UNSENT);
    }
    get instanceId() {
        return this._instanceId;
    }
}
