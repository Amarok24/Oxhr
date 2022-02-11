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

import {XhrHandler} from './xhr-handler.js';
import {OxhrError} from './oxhr-error.js';
import {XhrReadyState} from './xhr-codes.js';
import {generateUUID} from './generate-uuid.js';

import type {IOxhrParams, CombinedDataType} from "./oxhr-types.js";

export {Oxhr};


class Oxhr<T = unknown> extends XhrHandler<T>
{
  private _instanceId: string = generateUUID();

  constructor(parameters: IOxhrParams)
  {
    super(parameters);
  }

  /**
   * Returns a unique instance UUID.
   */
  get instanceId(): string
  {
    return this._instanceId;
  }

  send(data?: CombinedDataType): Promise<T> | never
  {
    this.debugMessage(`xhr.readyState ${ this.xhr.readyState }`);
    if (this.xhr.readyState !== XhrReadyState.UNSENT)
    {
      throw new OxhrError('A violation occured, the same connection is already being processed or has already finished.');
    }

    this.data = data ?? this.data;

    // Send has to return type Promise to work correctly with 'await'.
    // "this.xhrExecutor" will be called before the Promise gets returned.
    return new Promise<T>(this.xhrExecutor);
  }

  abort(): void
  {
    if (this.xhr.readyState !== XhrReadyState.LOADING)
    {
      console.log('Oxhr: Cannot abort because no connection is running.');
      return;
    }
    console.log('Oxhr: Aborting connection...');
    this.xhr.abort();
  }
}
