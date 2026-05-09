import { GameObject } from "./gameObject.js";

class Background extends GameObject {
    public draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this._x, this._y, this.w, this.h);
  }
}

export { Background };