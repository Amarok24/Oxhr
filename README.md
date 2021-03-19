# Oxhr
An object-oriented XHR (XMLHttpRequest) wrapper/library.

### Modern programmers use fetch, others use Oxhr.

<img width="180" alt="Oxhr logo" src="./oxhr-logo.svg" />

### Why Oxhr?
- Promise-based (asynchronous)
- Written in TypeScript with no dependencies
- An alternative to XMLHttpRequest and fetch
- An alternative to feature-rich libraries like [axios](https://github.com/axios/axios)
- Very small filesize (currently only 2kb minified)
- Bundled and ready-to-use as `bundle.min.js` for your JavaScript projects (no module)
- Made with simplicity in mind, ready for production with basic common features
- All 8 XHR events used, 5 of them can be handled by callback parameters
- A small demo included in `index.html`

There is also an old version of the library called jXhr which was not written using OOP, see [here](https://github.com/Amarok24/Oxhr/tree/non-oop-version).

---

## FAQs

### How can I stop a running connection?
- Very easily, you don't need special constructs like the AbortController in Fetch API. In Oxhr you simply call the Abort method. See the included demo.

### Can I open multiple connections at once?
- Yes and no. It's not possible using one instance of Oxhr, but you can create multiple (independent) instances. Since Oxhr works with EcmaScript's Promise object you can also make use of Promise.all(), Promise.any() and so on.


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
