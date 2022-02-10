// This is just a polyfill for the new Crypto API. As of today (Feb 2022) TypeScript type definition files are missing the randomUUID method.
// https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID

// TODO: abandon this polyfill as soon as TypeScript gets updated.

export {generateUUID};


interface CryptoNew extends Crypto
{
  randomUUID?(): string;
}

function generateUUID(): string
{
  let cryptoRef: CryptoNew | null = null;
  let r: string | undefined = '';

  if (typeof self.crypto !== 'undefined')
  {
    // Checks if Crypto API exists.
    cryptoRef = self.crypto as CryptoNew;
    r = cryptoRef.randomUUID?.();
  }

  if (!r)
  {
    r = 'Crypto API or randomUUID method not supported.';
  }

  return r;
}
