import { BubbleBase } from "./BubbleBase";
export class BubbleDiv extends BubbleBase {
    constructor() {
        super();
        this.ids = [];
    }
    load(data) {
        super.load(data);
        if (!(data !== undefined && data.ids !== undefined)) {
            return;
        }
        this.ids = data.ids;
    }
}
