# Oxhr
An object-oriented XHR (XMLHttpRequest) wrapper/library.

### Modern programmers use fetch, others use Oxhr 🐮

<img width="180" alt="Oxhr logo" src="./oxhr-logo.svg" />

### Why Oxhr?
- Promise-based (asynchronous)
- Written in TypeScript
- No dependencies
- Tiny filesize (2kb minified)
- Bundled and ready-to-use (ES module `bundle.min.js`) for your JavaScript projects
- An alternative to XMLHttpRequest and fetch
- An alternative to feature-rich libraries like [axios](https://github.com/axios/axios)
- Made with simplicity in mind, with most-used features
- All XHR events used, 4 of them can be passed as callback parameters
- A small demo included in `index.html`

There is also an old version of the library called jXhr which was not written using OOP, see [here](https://github.com/Amarok24/Oxhr/tree/non-oop-version).

---
## API

__Import modules and create a new instance in TypeScript__

```ts
import { Oxhr } from "./oxhr.ts";
import type { IXhrParams, IRequestHeader } from "./oxhrtypes.ts";

async function FetchDataExample()
{
	const options: IXhrParams = {
		url: "https://swapi.dev/api/people/1",
		consoleInfo: "Establishing my connection...",
		LoadEnd: () => { console.log("Loading finished!") }
	};

	// The shortest possible call if you don't care about the return type.
	const myConnection = new Oxhr(options);
	const result: any = await myConnection.Send();
	console.log(result);
}
```

__The parameters interface__

```ts
interface IXhrParams
{
  url: string;
  method?: "get" | "post";
  responseType?: XMLHttpRequestResponseType;
  data?: BodyInit | Document | null;
  requestHeaders?: IRequestHeader[];
  timeoutMs?: number;
  consoleInfo?: string;
  LoadEnd?: () => void;
  Progress?: (percent: number, bytes: number) => void;
  TimeOut?: () => void;
  Abort?: () => void;
}
```

__Parameters__

| Parameter      |   Description             | Required | Default   | Accepted types                                        |
| :------------- | :------------------------ | :------: | :-------: | :---------------------------------------------------- |
| url            |  URL for http request     |     x    |           | string                                                |
| method         |  HTTP request method      |          | "get"     | string ("get" or "post")                              |
| responseType   |  A valid response type    |          | ""        | "", "arraybuffer", "blob", "document", "json", "text" |
| data           |  Data to send             |          | null      | Blob, BufferSource, FormData, URLSearchParams,  ReadableStream<Uint8Array>, string, Document, null |
| requestHeaders |  array of IRequestHeader  |          |           | IRequestHeader[]                                      |
| timeoutMs      |  Timeout in milliseconds  |          | 60'000    | number                                                |
| consoleInfo    |  Timeout in milliseconds  |          |           | string                                                |

__Callbacks__

| Name     |   Description                                | Parameters                       |
| :------- | :------------------------------------------- | :------------------------------- |
| LoadEnd  |  Called after load success, timeout or error |                                  |
| Progress |  For loading progress in percent and bytes   | (percent: number, bytes: number) |
| TimeOut  |  Time out callback (see timeoutMs above)     |                                  |
| Abort    |  To stop an open connection (see demo)       |                                  |

Please note that progress in % must not always work because it depends on server settings.

## FAQs

### How can I stop a running connection?
- Very easily, you don't need special constructs like the `AbortController()` in Fetch API. In Oxhr you simply call the `Abort()` method. See the included demo.

### Can I open multiple connections at once?
- Yes and no. It's not possible using one instance of Oxhr, but you can create multiple (independent) instances. Since Oxhr works with EcmaScript's Promise object you can also make use of Promise.all(), Promise.any() etc.


---

<b>Tools used in this project:</b>

### Deno
A secure runtime for JavaScript and TypeScript.
Used for bundling the .ts sources to single .js file.
[Homepage](https://deno.land/)

To reproduce my development environment in VSCode just put this code into your `settings.json` inside of `.vscode` folder:

`
{
	"deno.enable": true,
	"deno.lint": false,
	"deno.unstable": false,
	"deno.config": "./tsconfig.json"
}
`

### Terser
JavaScript parser, mangler and compressor toolkit for ES6+.
Used for minifying the bundled .js file.
[Homepage](https://terser.org/)

---


### License:
This project is released as permissive free software under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
