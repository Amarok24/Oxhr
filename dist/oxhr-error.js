export { OxhrError };
class OxhrError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OxhrError';
    }
}
