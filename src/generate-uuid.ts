// As of today (Feb 2022) TypeScript type definition files lack the randomUUID method.
// https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
// This is a simple workaround which exports the generateUUID method (ES module).

// TODO: abandon this polyfill as soon as TypeScript gets updated.

export {generateUUID};

interface CryptoNew extends Crypto
{
  randomUUID?(): string;
}

// Returns an empty string if Crypto API or randomUUID is not supported by browser.
function generateUUID(): string
{
  let cryptoRef: CryptoNew;
  let r: string | undefined = '';

  if (typeof self.crypto !== 'undefined')
  {
    cryptoRef = self.crypto as CryptoNew;
    r = cryptoRef.randomUUID?.();
  }

  return r ? r : '';
}
