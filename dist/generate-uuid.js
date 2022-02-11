export { generateUUID };
function generateUUID() {
    let cryptoRef;
    let r = '';
    if (typeof self.crypto !== 'undefined') {
        cryptoRef = self.crypto;
        r = cryptoRef.randomUUID?.();
    }
    return r ? r : '';
}
