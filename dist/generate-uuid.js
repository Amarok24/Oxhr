export { generateUUID };
function generateUUID() {
    let cryptoRef = null;
    let r = '';
    if (typeof self.crypto !== 'undefined') {
        cryptoRef = self.crypto;
        r = cryptoRef.randomUUID?.();
    }
    if (!r) {
        r = 'Crypto API or randomUUID method not supported.';
    }
    return r;
}
