import { RepulseBase } from "./RepulseBase";
export class RepulseDiv extends RepulseBase {
    constructor() {
        super();
        this.ids = [];
    }
    load(data) {
        super.load(data);
        if (data === undefined) {
            return;
        }
        if (data.ids === undefined) {
            return;
        }
        this.ids = data.ids;
    }
}
