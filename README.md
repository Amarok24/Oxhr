# Oxhr v1.2.0
An object-oriented and asynchronous XHR (XMLHttpRequest) wrapper.

### Modern programmers use fetch, others prefer Oxhr 🐮

<img width="180" alt="Oxhr logo" src="./oxhr-logo.svg" />

### Why Oxhr?
- Written in TypeScript
- Promise-based (asynchronous)
- Modular (JavaScript modules)
- Tiny (under 5kb minified)
- No dependencies
- Robust and simple, useful for most tasks
- An alternative to _XMLHttpRequest_ and _fetch_
- An alternative to feature-rich and complex libraries like [_axios_](https://github.com/axios/axios)

A small demo is included, see `index.html`. If you prefer a plain .js file instead of a modular system you can use a bundler to combine all modules into one file; for such a task I recommend [Deno](https://deno.land/) which has a bundle feature.

---
## API

__Import modules and create a new instance in TypeScript__

```ts
import { Oxhr } from "./oxhr.js";
import type { IOxhrParams, IRequestHeader } from "./oxhr-types.js";

async function fetchDataExample()
{
  let response: any;
  const options: IOxhrParams = {
    url: "https://...",
    onLoadEnd: () => { alert("Finished!") }
  };

  // The shortest possible call if you don't care about the return type.
  const myConnection = new Oxhr(options);

  // Send request to the server and output response data to console.
  response = await myConnection.send();
  console.log(response);
}
```

__The parameters interface__

```ts
interface IOxhrParams
{
  url: string;
  method?: "GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
  responseType?: XMLHttpRequestResponseType;
  data?: XMLHttpRequestBodyInit | Document | null;
  requestHeaders?: IRequestHeader[];
  timeoutMs?: number;
  consoleMessage?: string;
  debug?: boolean;
  onLoadEnd?: () => void;
  onProgress?: (percent: number, bytes: number) => void;
  onTimeout?: () => void;
  onAbort?: () => void;
}
```

### Parameters

| Parameter      |   Description           | Required | Default | Accepted types |
| :------------- | :----------------------- | :-----: | :----: | :--- |
| url            | URL for http request     |   x     |         | string |
| method         | HTTP request method      |   -     | "GET"   | string ("GET" \| "POST" \| etc...)) |
| responseType   | One of response types    |   -     | ""      | "", "arraybuffer", "blob", "document", "json", "text" |
| data           | Data to send             |   -     | null    | Blob, BufferSource, FormData, URLSearchParams,  ReadableStream, string, Document, null |
| requestHeaders | Array of IRequestHeader  |   -     |         | IRequestHeader[] |
| timeoutMs      | Timeout in milliseconds.  If the request takes longer, it will be terminated.  |   -   | 0  | number  |
| consoleMessage    | Description for console output after loading is done. | - |         | string  |
| debug          | Additional console output | - | false | boolean |


### Callbacks

| Name       | Description                                   | Parameters                       |
| :--        | :--                                           | :--                              |
| onLoadEnd  | Called after success, timeout, abort or error | --                               |
| onProgress | Ongoing loading progress in percent and bytes | (percent: number, bytes: number) |
| onTimeout  | Timeout callback (see timeoutMs parameter)   | --                               |
| onAbort    | When an open connection gets aborted          | --                               |

Please note that progress in % must not always work because it depends on server settings (not all connections give you the total data/file size in advance).

### Methods

| Name   | Description                     | Parameters   |
| :--    | :--                             | :--          |
| send   | Sends the request to the server | data?        |
| abort  | Aborts an open connection       | --           |


### Properties (read-only)

| Name   | Description                     |
| :--    | :--                             | 
| instanceId   | A unique ID of the Oxhr instance (UUID). | 
| readyState  | The XHR readyState code.    | 
| status  | The XHR status code.   |
| success  | Returns _true_ if transfer was successful (readyState is DONE and status is OK).  |
| isProcessed  | Returns _true_ if a request is already being processed. |


## FAQs

__How can I stop a running connection?__
- Very easily, you don't need the `AbortController()` object which is needed for the Fetch API. In Oxhr you simply call the `abort` method. See the included demo.

__Can I open multiple connections at once?__
- Yes and no. It's not possible using one instance of Oxhr, but you can create multiple (independent) instances (each instance will have its own unique UUID). Since Oxhr works with EcmaScript's Promise object you can also make use of Promise.all(), Promise.any() etc. Additionally, you can start multiple "await ... send()" requests using one class instance, they will be handled one after another.


## Changelog
### _v1.2.0_
- Many code improvements, now the library is more robust and handles all kind of wrong usage in a nice way
- Added 4 new getters: instanceId, status, success, isProcessed
- Major code refactoring
- Previous version didn't compile in TypeScript 4.5.4 because of an error, this update fixes it
- Several small bugfixes, one big bugfix for custom onLoadEnd method which didn't get triggered in TypeScript 4.5.4
- Added new "debug" parameter for more verbose console log
- Demo in index.html changed significantly

---


### License:
This project is released as permissive free software under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
