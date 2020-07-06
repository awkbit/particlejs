import { NoiseRandom } from "./NoiseRandom";
export class NoiseDelay {
    constructor() {
        this.random = new NoiseRandom();
        this.value = 0;
    }
    load(data) {
        var _a;
        if (data === undefined) {
            return;
        }
        (_a = this.random) === null || _a === void 0 ? void 0 : _a.load(data.random);
        if (data.value !== undefined) {
            this.value = data.value;
        }
    }
}
