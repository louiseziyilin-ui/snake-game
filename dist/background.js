// import { Canvas } from "./canvas.js";
// import { GameObject } from "./gameObject.js";
// import { Controller } from "./controller.js";
// import { Snake } from "./snake.js";
// class Background extends GameObject {
//   /** @type {number} The velocity at which the background moves */ 
//   private velocity: number = 200; 
//   /** @type {boolean} Indicates if the background has moved in the current frame */ 
//   private moved: boolean = false; 
//   // public draw(context: CanvasRenderingContext2D): void {
//   //   context.drawImage(image, this._x, this._y, this.w, this.h);
//   // }
//   public update(controller: Controller, snake: Snake, deltaTime: number): void {
//     const adjustedVelocity: number = this.velocity * (deltaTime / 1000);
//     this.moved = false;
//     // Handles left movement
//     if (controller.left) {
//       if (this.x < 0 && snake.x <= Canvas.WIDTH / 2 - snake.w / 2) {
//         this._x += adjustedVelocity;
//         this.moved = true;
//       }
//       else if (snake.x > 0) {
//         snake.moveLeft(deltaTime);
//         this.moved = true;
//       }
//     }
//     // Handles right movement
//     if (controller.right) {
//       if (this.x + this.w > Canvas.WIDTH && snake.x >= Canvas.WIDTH / 2) {
//         this._x -= adjustedVelocity;
//         this.moved = true;
//       }
//       else if (snake.x + snake.w < Canvas.WIDTH) {
//         snake.moveRight(deltaTime);
//         this.moved = true;
//       }
//     }
//     // Handles up movement
//     if (controller.up) {
//       if (this.y < 0 && snake.y <= Canvas.HEIGHT / 2 - snake.h / 2) {
//         this._y += adjustedVelocity;
//         this.moved = true;
//       }
//       else if (snake.y > 0) {
//         snake.moveUp(deltaTime);
//         this.moved = true;
//       }
//     }
//     // Handles down movement
//     if (controller.down) {
//       if (this.y + this.h > Canvas.HEIGHT && snake.y >= Canvas.HEIGHT / 2 - snake.h/2) {
//         this._y -= adjustedVelocity; 
//         this.moved = true;
//       }
//       else if (snake.y + snake.h < Canvas.HEIGHT) {
//         snake.moveDown(deltaTime);
//         this.moved = true;
//       }
//     }
//     // If the background doesn't move, update the snake
//     if (!this.moved) {
//       snake.update(controller, deltaTime);
//     }
//   }
// }
// export { Background };
import { GameObject } from "./gameObject.js";
class Background extends GameObject {
    draw(context) {
        context.drawImage(this.image, this._x, this._y, this.w, this.h);
    }
}
export { Background };
//# sourceMappingURL=background.js.map