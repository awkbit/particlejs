export class FrameManager {
    constructor(container) {
        this.container = container;
    }
    nextFrame(timestamp) {
        const container = this.container;
        const {options, lastFrameTime} = container;
        const fpsLimit = options.fpsLimit > 0 ? options.fpsLimit : 60;
        if (lastFrameTime !== undefined && timestamp < lastFrameTime + 1000 / fpsLimit) {
            container.draw();
            return;
        }
        const delta = timestamp - lastFrameTime;
        container.lastFrameTime = timestamp;
        container.particles.draw(delta);
        if (options.particles.move.enable && container.getAnimationStatus()) {
            container.draw();
        }
    }
}
