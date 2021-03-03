# jXhr
A Promise-based asynchronous XMLHttpRequest (XHR) wrapper/library.

### Still under development, come back later....

- Written in TypeScript (TS module)
- No dependencies
- Very small filesize (currently only 2kb)
- Bundled and ready-to-use as `bundle.min.js` for JavaScript projects (no module)
- An alternative to vanilla XMLHttpRequest and fetch
- An alternative to feature-rich libraries like [axios](https://github.com/axios/axios)
- Built-in common features (data transfer progress, cancellation of transfer, custom headers...)
- A small demo included in `index.html`

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
