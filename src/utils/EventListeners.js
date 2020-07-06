import { ClickMode, InteractivityDetect } from "@enums";
import { Constants } from "./Constants";
export class EventListeners {
  constructor(container) {
    this.container = container;
    this.canPush = true;
    this.mouseMoveHandler = (e) => this.mouseTouchMove(e);
    this.touchStartHandler = (e) => this.mouseTouchMove(e);
    this.touchMoveHandler = (e) => this.mouseTouchMove(e);
    this.touchEndHandler = () => this.mouseTouchFinish();
    this.mouseLeaveHandler = () => this.mouseTouchFinish();
    this.touchCancelHandler = () => this.mouseTouchFinish();
    this.touchEndClickHandler = (e) => this.mouseTouchClick(e);
    this.mouseUpHandler = (e) => this.mouseTouchClick(e);
    this.visibilityChangeHandler = () => this.handleVisibilityChange();
    this.resizeHandler = () => this.handleWindowResize();
  }
  static manageListener(element, event, handler, add, options) {
    if (add) {
      let addOptions = { passive: true };
      if (typeof options === "boolean") {
        addOptions.capture = options;
      } else if (options !== undefined) {
        addOptions = options;
      }
      element.addEventListener(event, handler, addOptions);
    } else {
      const removeOptions = options;
      element.removeEventListener(event, handler, removeOptions);
    }
  }
  addListeners() {
    this.manageListeners(true);
  }
  removeListeners() {
    this.manageListeners(false);
  }
  manageListeners(add) {
    const container = this.container;
    const options = container.options;
    const detectType = options.interactivity.detectsOn;
    if (detectType === InteractivityDetect.window) {
      container.interactivity.element = window;
    } else if (
      detectType === InteractivityDetect.parent &&
      container.canvas.element
    ) {
      container.interactivity.element = container.canvas.element.parentNode;
    } else {
      container.interactivity.element = container.canvas.element;
    }
    const interactivityEl = container.interactivity.element;
    if (
      interactivityEl &&
      (options.interactivity.events.onHover.enable ||
        options.interactivity.events.onClick.enable)
    ) {
      EventListeners.manageListener(
        interactivityEl,
        Constants.mouseMoveEvent,
        this.mouseMoveHandler,
        add
      );
      EventListeners.manageListener(
        interactivityEl,
        Constants.touchStartEvent,
        this.touchStartHandler,
        add
      );
      EventListeners.manageListener(
        interactivityEl,
        Constants.touchMoveEvent,
        this.touchMoveHandler,
        add
      );
      if (!options.interactivity.events.onClick.enable) {
        EventListeners.manageListener(
          interactivityEl,
          Constants.touchEndEvent,
          this.touchEndHandler,
          add
        );
      }
      EventListeners.manageListener(
        interactivityEl,
        Constants.mouseLeaveEvent,
        this.mouseLeaveHandler,
        add
      );
      EventListeners.manageListener(
        interactivityEl,
        Constants.touchCancelEvent,
        this.touchCancelHandler,
        add
      );
    }
    if (options.interactivity.events.onClick.enable && interactivityEl) {
      EventListeners.manageListener(
        interactivityEl,
        Constants.touchEndEvent,
        this.touchEndClickHandler,
        add
      );
      EventListeners.manageListener(
        interactivityEl,
        Constants.mouseUpEvent,
        this.mouseUpHandler,
        add
      );
    }
    if (options.interactivity.events.resize) {
      EventListeners.manageListener(
        window,
        Constants.resizeEvent,
        this.resizeHandler,
        add
      );
    }
    if (document) {
      EventListeners.manageListener(
        document,
        Constants.visibilityChangeEvent,
        this.visibilityChangeHandler,
        add,
        false
      );
    }
  }
  handleWindowResize() {
    const container = this.container;
    const options = container.options;
    const canvas = container.canvas.element;
    if (!canvas) {
      return;
    }
    const pxRatio = container.retina.pixelRatio;
    container.canvas.size.width = canvas.offsetWidth * pxRatio;
    container.canvas.size.height = canvas.offsetHeight * pxRatio;
    canvas.width = container.canvas.size.width;
    canvas.height = container.canvas.size.height;
    if (!options.particles.move.enable) {
      container.particles.redraw();
    }
    container.densityAutoParticles();
    for (const [, plugin] of container.plugins) {
      if (plugin.resize !== undefined) {
        plugin.resize();
      }
    }
  }
  handleVisibilityChange() {
    const container = this.container;
    const options = container.options;
    if (!options.pauseOnBlur) {
      return;
    }
    if (document === null || document === void 0 ? void 0 : document.hidden) {
      container.pageHidden = true;
      container.pause();
    } else {
      container.pageHidden = false;
      if (container.getAnimationStatus()) {
        container.play(true);
      } else {
        container.draw();
      }
    }
  }
  mouseTouchMove(e) {
    var _a, _b, _c;
    const container = this.container;
    const options = container.options;
    let pos;
    const canvas = container.canvas.element;
    if (e.type.startsWith("mouse")) {
      this.canPush = true;
      const mouseEvent = e;
      if (
        ((_a = container.interactivity) === null || _a === void 0
          ? void 0
          : _a.element) === undefined
      ) {
        return;
      }
      if (container.interactivity.element === window) {
        if (canvas) {
          const clientRect = canvas.getBoundingClientRect();
          pos = {
            x: mouseEvent.clientX - clientRect.left,
            y: mouseEvent.clientY - clientRect.top,
          };
        }
      } else if (
        options.interactivity.detectsOn === InteractivityDetect.parent
      ) {
        const source = mouseEvent.target;
        const target = mouseEvent.currentTarget;
        if (source && target) {
          const sourceRect = source.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          pos = {
            x: mouseEvent.offsetX + sourceRect.left - targetRect.left,
            y: mouseEvent.offsetY + sourceRect.top - targetRect.top,
          };
        } else {
          pos = {
            x: mouseEvent.offsetX || mouseEvent.clientX,
            y: mouseEvent.offsetY || mouseEvent.clientY,
          };
        }
      } else {
        if (mouseEvent.target === container.canvas.element) {
          pos = {
            x: mouseEvent.offsetX || mouseEvent.clientX,
            y: mouseEvent.offsetY || mouseEvent.clientY,
          };
        }
      }
    } else {
      this.canPush = e.type !== "touchmove";
      const touchEvent = e;
      const lastTouch = touchEvent.touches[touchEvent.touches.length - 1];
      const canvasRect =
        canvas === null || canvas === void 0
          ? void 0
          : canvas.getBoundingClientRect();
      pos = {
        x:
          lastTouch.clientX -
          ((_b =
            canvasRect === null || canvasRect === void 0
              ? void 0
              : canvasRect.left) !== null && _b !== void 0
            ? _b
            : 0),
        y:
          lastTouch.clientY -
          ((_c =
            canvasRect === null || canvasRect === void 0
              ? void 0
              : canvasRect.top) !== null && _c !== void 0
            ? _c
            : 0),
      };
    }
    const pxRatio = container.retina.pixelRatio;
    if (pos) {
      pos.x *= pxRatio;
      pos.y *= pxRatio;
    }
    container.interactivity.mouse.position = pos;
    container.interactivity.status = Constants.mouseMoveEvent;
  }
  mouseTouchFinish() {
    const container = this.container;
    delete container.interactivity.mouse.position;
    container.interactivity.status = Constants.mouseLeaveEvent;
  }
  mouseTouchClick(e) {
    const container = this.container;
    const options = container.options;
    let handled = false;
    const mousePosition = container.interactivity.mouse.position;
    if (
      mousePosition === undefined ||
      !options.interactivity.events.onClick.enable
    ) {
      return;
    }
    for (const [, plugin] of container.plugins) {
      if (plugin.clickPositionValid !== undefined) {
        handled = plugin.clickPositionValid(mousePosition);
        if (handled) {
          break;
        }
      }
    }
    if (!handled) {
      this.doMouseTouchClick(e);
    }
  }
  doMouseTouchClick(e) {
    const container = this.container;
    const options = container.options;
    if (this.canPush) {
      const mousePos = container.interactivity.mouse.position;
      if (mousePos) {
        container.interactivity.mouse.clickPosition = {
          x: mousePos.x,
          y: mousePos.y,
        };
      } else {
        return;
      }
      container.interactivity.mouse.clickTime = new Date().getTime();
      const onClick = options.interactivity.events.onClick;
      if (onClick.mode instanceof Array) {
        for (const mode of onClick.mode) {
          this.handleClickMode(mode);
        }
      } else {
        this.handleClickMode(onClick.mode);
      }
    }
    if (e.type === "touchend") {
      setTimeout(() => this.mouseTouchFinish(), 500);
    }
  }
  handleClickMode(mode) {
    const container = this.container;
    const options = container.options;
    const pushNb = options.interactivity.modes.push.quantity;
    const removeNb = options.interactivity.modes.remove.quantity;
    switch (mode) {
      case ClickMode.push: {
        if (pushNb > 0) {
          if (options.particles.move.enable) {
            container.particles.push(pushNb, container.interactivity.mouse);
          } else {
            if (pushNb === 1) {
              container.particles.push(pushNb, container.interactivity.mouse);
            } else if (pushNb > 1) {
              container.particles.push(pushNb);
            }
          }
        }
        break;
      }
      case ClickMode.remove:
        container.particles.removeQuantity(removeNb);
        break;
      case ClickMode.bubble:
        container.bubble.clicking = true;
        break;
      case ClickMode.repulse:
        container.repulse.clicking = true;
        container.repulse.count = 0;
        for (const particle of container.repulse.particles) {
          particle.velocity.horizontal = particle.initialVelocity.horizontal;
          particle.velocity.vertical = particle.initialVelocity.vertical;
        }
        container.repulse.particles = [];
        container.repulse.finish = false;
        setTimeout(() => {
          if (!container.destroyed) {
            container.repulse.clicking = false;
          }
        }, options.interactivity.modes.repulse.duration * 1000);
        break;
      case ClickMode.pause:
        if (container.getAnimationStatus()) {
          container.pause();
        } else {
          container.play();
        }
        break;
    }
    for (const [, plugin] of container.plugins) {
      if (plugin.handleClickMode) {
        plugin.handleClickMode(mode);
      }
    }
  }
}
