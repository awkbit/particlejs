import React from "react";

import { Container } from "./Core/Container";

export default class Particles extends React.PureComponent {
  canvas = null;
  library = null;

  constructor(props) {
    super(props);

    this.loadCanvas = this.loadCanvas.bind(this);
  }

  buildParticlesLibrary = (tagId, params) => {
    try {
      if (window === undefined) return null;
    } catch {
      return null;
    } // SSR

    const container = new Container(tagId, params);

    if (this.props.container) {
      this.props.container.current = container;
    }

    return container;
  };

  refresh() {
    if (this.canvas) {
      this.destroy();
      this.start();
    }
  }

  destroy() {
    if (this.library) {
      this.library.destroy();
      this.library = null;
    }
  }
  start() {
    this.library = this.buildParticlesLibrary(this.props.id, this.props.params);
    this.library.canvas.loadCanvas(this.canvas);
    this.library.start();
  }

  loadCanvas(canvas) {
    this.canvas = canvas;
  }

  componentDidUpdate() {
    this.refresh(this.props);
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.destroy();
  }

  forceUpdate() {
    this.refresh(this.props);
    super.forceUpdate();
  }

  render() {
    let { width, height, className, canvasClassName, id } = this.props;
    return (
      <div className={className} id={id}>
        <canvas
          ref={this.loadCanvas}
          className={canvasClassName}
          style={{
            ...this.props.style,
            width,
            height,
          }}
        />
      </div>
    );
  }
}

Particles.defaultProps = {
  width: "100%",
  height: "100%",
  params: {},
  style: {},
  id: "tsparticles",
};
