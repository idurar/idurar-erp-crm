# bcrypt.js

Optimized bcrypt in JavaScript with zero dependencies, with TypeScript support. Compatible to the C++
[bcrypt](https://npmjs.org/package/bcrypt) binding on Node.js and also working in the browser.

[![Build Status](https://img.shields.io/github/actions/workflow/status/dcodeIO/bcrypt.js/test.yml?branch=main&label=test&logo=github)](https://github.com/dcodeIO/bcrypt.js/actions/workflows/test.yml) [![Publish Status](https://img.shields.io/github/actions/workflow/status/dcodeIO/bcrypt.js/publish.yml?branch=main&label=publish&logo=github)](https://github.com/dcodeIO/bcrypt.js/actions/workflows/publish.yml) [![npm](https://img.shields.io/npm/v/bcryptjs.svg?label=npm&color=007acc&logo=npm)](https://www.npmjs.com/package/bcryptjs)

## Security considerations

Besides incorporating a salt to protect against rainbow table attacks, bcrypt is an adaptive function: over time, the
iteration count can be increased to make it slower, so it remains resistant to brute-force search attacks even with
increasing computation power. ([see](http://en.wikipedia.org/wiki/Bcrypt))

While bcrypt.js is compatible to the C++ bcrypt binding, it is written in pure JavaScript and thus slower ([about 30%](https://github.com/dcodeIO/bcrypt.js/wiki/Benchmark)), effectively reducing the number of iterations that can be
processed in an equal time span.

The maximum input length is 72 bytes (note that UTF-8 encoded characters use up to 4 bytes) and the length of generated
hashes is 60 characters. Note that maximum input length is not implicitly checked by the library for compatibility with
the C++ binding on Node.js, but should be checked with `bcrypt.truncates(password)` where necessary.

## Usage

The package exports an ECMAScript module with an UMD fallback.

```
$> npm install bcryptjs
```

```ts
import bcrypt from "bcryptjs";
```

### Usage with a CDN

- From GitHub via [jsDelivr](https://www.jsdelivr.com):<br />
  `https://cdn.jsdelivr.net/gh/dcodeIO/bcrypt.js@TAG/index.js` (ESM)
- From npm via [jsDelivr](https://www.jsdelivr.com):<br />
  `https://cdn.jsdelivr.net/npm/bcryptjs@VERSION/index.js` (ESM)<br />
  `https://cdn.jsdelivr.net/npm/bcryptjs@VERSION/umd/index.js` (UMD)
- From npm via [unpkg](https://unpkg.com):<br />
  `https://unpkg.com/bcryptjs@VERSION/index.js` (ESM)<br />
  `https://unpkg.com/bcryptjs@VERSION/umd/index.js` (UMD)

Replace `TAG` respectively `VERSION` with a [specific version](https://github.com/dcodeIO/bcrypt.js/releases) or omit it (not recommended in production) to use latest.

When using the ESM variant in a browser, the `crypto` import needs to be stubbed out, for example using an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap). Bundlers should omit it automatically.

### Usage - Sync

To hash a password:

```ts
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0/\/", salt);
// Store hash in your password DB
```

To check a password:

```ts
// Load hash from your password DB
bcrypt.compareSync("B4c0/\/", hash); // true
bcrypt.compareSync("not_bacon", hash); // false
```

Auto-gen a salt and hash:

```ts
const hash = bcrypt.hashSync("bacon", 10);
```

### Usage - Async

To hash a password:

```ts
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash("B4c0/\/", salt);
// Store hash in your password DB
```

```ts
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash("B4c0/\/", salt, function (err, hash) {
    // Store hash in your password DB
  });
});
```

To check a password:

```ts
// Load hash from your password DB
await bcrypt.compare("B4c0/\/", hash); // true
await bcrypt.compare("not_bacon", hash); // false
```

```ts
// Load hash from your password DB
bcrypt.compare("B4c0/\/", hash, (err, res) => {
  // res === true
});
bcrypt.compare("not_bacon", hash, (err, res) => {
  // res === false
});
```

Auto-gen a salt and hash:

```ts
await bcrypt.hash("B4c0/\/", 10);
// Store hash in your password DB
```

```ts
bcrypt.hash("B4c0/\/", 10, (err, hash) => {
  // Store hash in your password DB
});
```

**Note:** Under the hood, asynchronous APIs split an operation into small chunks. After the completion of a chunk, the execution of the next chunk is placed on the back of the [JS event queue](https://developer.mozilla.org/en/docs/Web/JavaScript/EventLoop), efficiently yielding for other computation to execute.

### Usage - Command Line

```
Usage: bcrypt <input> [rounds|salt]
```

## API

### Callback types

- **Callback<`T`>**: `(err: Error | null, result?: T) => void`<br />
  Called with an error on failure or a value of type `T` upon success.

- **ProgressCallback**: `(percentage: number) => void`<br />
  Called with the percentage of rounds completed (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.

- **RandomFallback**: `(length: number) => number[]`<br />
  Called to obtain random bytes when both [Web Crypto API](http://www.w3.org/TR/WebCryptoAPI/) and Node.js
  [crypto](http://nodejs.org/api/crypto.html) are not available.

### Functions

- bcrypt.**genSaltSync**(rounds?: `number`): `string`<br />
  Synchronously generates a salt. Number of rounds defaults to 10 when omitted.

- bcrypt.**genSalt**(rounds?: `number`): `Promise<string>`<br />
  Asynchronously generates a salt. Number of rounds defaults to 10 when omitted.

- bcrypt.**genSalt**([rounds: `number`, ]callback: `Callback<string>`): `void`<br />
  Asynchronously generates a salt. Number of rounds defaults to 10 when omitted.

- bcrypt.**truncates**(password: `string`): `boolean`<br />
  Tests if a password will be truncated when hashed, that is its length is greater than 72 bytes when converted to UTF-8.

- bcrypt.**hashSync**(password: `string`, salt?: `number | string`): `string`
  Synchronously generates a hash for the given password. Number of rounds defaults to 10 when omitted.

- bcrypt.**hash**(password: `string`, salt: `number | string`): `Promise<string>`<br />
  Asynchronously generates a hash for the given password.

- bcrypt.**hash**(password: `string`, salt: `number | string`, callback: `Callback<string>`, progressCallback?: `ProgressCallback`): `void`<br />
  Asynchronously generates a hash for the given password.

- bcrypt.**compareSync**(password: `string`, hash: `string`): `boolean`<br />
  Synchronously tests a password against a hash.

- bcrypt.**compare**(password: `string`, hash: `string`): `Promise<boolean>`<br />
  Asynchronously compares a password against a hash.

- bcrypt.**compare**(password: `string`, hash: `string`, callback: `Callback<boolean>`, progressCallback?: `ProgressCallback`)<br />
  Asynchronously compares a password against a hash.

- bcrypt.**getRounds**(hash: `string`): `number`<br />
  Gets the number of rounds used to encrypt the specified hash.

- bcrypt.**getSalt**(hash: `string`): `string`<br />
  Gets the salt portion from a hash. Does not validate the hash.

- bcrypt.**setRandomFallback**(random: `RandomFallback`): `void`<br />
  Sets the pseudo random number generator to use as a fallback if neither [Web Crypto API](http://www.w3.org/TR/WebCryptoAPI/) nor Node.js [crypto](http://nodejs.org/api/crypto.html) are available. Please note: It is highly important that the PRNG used is cryptographically secure and that it is seeded properly!

## Building

Building the UMD fallback:

```
$> npm run build
```

Running the [tests](./tests):

```
$> npm test
```

## Credits

Based on work started by Shane Girish at [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs), which is itself
based on [javascript-bcrypt](http://code.google.com/p/javascript-bcrypt/) (New BSD-licensed).
