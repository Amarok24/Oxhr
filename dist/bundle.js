export { Oxhr as Oxhr };
class Oxhr {
    xhr = new XMLHttpRequest();
    connectionRunning = false;
    constructor(parameters){
        this.params = parameters;
        this.method = parameters.method ? parameters.method : "get";
        this.data = parameters.data ? parameters.data : null;
        this.responseType = parameters.responseType ? parameters.responseType : "";
    }
    Send() {
        if (this.connectionRunning) {
            throw {
                message: "A connection is already running."
            };
        }
        this.connectionRunning = true;
        return new Promise(this.HttpExecutor);
    }
    Abort() {
        if (!this.connectionRunning) {
            console.log("No connection to abort.");
            return;
        }
        console.log("Aborting connection...");
        this.xhr.abort();
        this.connectionRunning = false;
    }
    HttpExecutor = (resolve, reject)=>{
        const HandleLoad = (ev)=>{
            console.log("HandleLoad");
            if (this.xhr.status >= 200 && this.xhr.status < 300) {
                resolve(this.xhr.response);
                if (this.params.consoleInfo) console.group(this.params.consoleInfo);
                console.log(`${ev.loaded} bytes loaded.`);
                if (this.params.consoleInfo) console.groupEnd();
            } else {
                reject(new Error(`HTML status code ${this.xhr.status}`));
            }
            this.connectionRunning = false;
        };
        const HandleError = (ev)=>{
            reject(new Error("jXhr: failed to send request!"));
            if (this.params.consoleInfo) console.group(this.params.consoleInfo);
            console.log(ev);
            console.error(`xhr.status ${this.xhr.status}`);
            if (this.params.consoleInfo) console.groupEnd();
            this.connectionRunning = false;
        };
        const HandleProgress = (ev)=>{
            if (ev.lengthComputable) {
                const percentComplete = ev.loaded / ev.total * 100;
                if (this.params.Progress) this.params.Progress(percentComplete, ev.loaded);
            } else {
                if (this.params.Progress) this.params.Progress(-1, ev.loaded);
            }
        };
        const HandleTimeout = ()=>{
            reject(new Error("TimeoutError"));
            this.connectionRunning = false;
        };
        this.xhr.open(this.method, this.params.url);
        if (this.params.requestHeaders) {
            this.params.requestHeaders.forEach((h)=>{
                if (h.header !== "" && h.value !== "") {
                    console.log(`Setting custom request header '${h.header}, ${h.value}'`);
                    this.xhr.setRequestHeader(h.header, h.value);
                }
            });
        }
        this.xhr.timeout = this.params.timeoutMs ? this.params.timeoutMs : 60000;
        this.xhr.responseType = this.responseType;
        this.xhr.addEventListener("load", HandleLoad);
        this.xhr.addEventListener("error", HandleError);
        this.xhr.addEventListener("progress", HandleProgress);
        if (this.params.LoadEnd) this.xhr.addEventListener("loadend", this.params.LoadEnd);
        if (this.params.Abort) this.xhr.addEventListener("abort", this.params.Abort);
        if (this.params.TimeOut) {
            this.xhr.addEventListener("timeout", this.params.TimeOut);
        } else {
            this.xhr.addEventListener("timeout", HandleTimeout);
        }
        this.xhr.send(this.data);
    };
}
