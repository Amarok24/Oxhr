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
import { XhrHandler } from './xhr-handler.js';
import { XhrReadyState } from './xhr-codes.js';
export { Oxhr };
class Oxhr extends XhrHandler {
    constructor(parameters) {
        super(parameters);
    }
    send(data) {
        this.debugMessage(`xhr.readyState ${this.xhr.readyState}`);
        if (this.isProcessed) {
            console.warn(`Oxhr: Either a request is being processed or has already finished. A new request using the same Oxhr instance will be opened.\nInstace UUID ${this.instanceId}`);
        }
        this.data = data ?? this.data;
        return new Promise(this.xhrExecutor);
    }
    abort() {
        if (this.xhr.readyState !== XhrReadyState.LOADING) {
            console.log('Oxhr: Cannot abort because no connection is running.');
            return;
        }
        console.log('Oxhr: Aborting connection...');
        this.xhr.abort();
    }
}
