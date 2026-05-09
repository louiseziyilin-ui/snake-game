import { GameObject } from './gameObject.js';
import { Utility } from './utility.js';
import { Canvas } from './canvas.js';
//@ts-ignore Import module
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid@3.3.4/nanoid.min.js";
class Snake extends GameObject {
    _velocity = 200;
    segmentImage;
    _id = nanoid();
    _width;
    constructor(x, y, width, height, image) {
        super(x, y, width, height, image);
        this.segmentImage = image;
        this._width = width;
    }
    draw(context) {
        context.fillStyle = "black";
        context.fillRect(this.x, this.y, this._width, this.h);
    }
    addSegment() {
        // Increase the width of the snake rectangle to simulate growth
        const growth = 10;
        this._width += growth;
    }
    moveRight(deltaTime) {
        const movement = Utility.adjustForDeltaTime(this._velocity, deltaTime);
        const nextRightEdge = this._x + this._width + movement;
        if (nextRightEdge <= Canvas.WIDTH) {
            this._x += movement;
        }
        else {
            // Stop at the right boundary, accounting for snake's width
            this._x = Canvas.WIDTH - this._width;
        }
    }
    moveLeft(deltaTime) {
        const movement = Utility.adjustForDeltaTime(this._velocity, deltaTime);
        const nextLeftEdge = this._x - movement;
        if (nextLeftEdge >= 0) {
            this._x -= movement;
        }
        else {
            // Stop at the left boundary
            this._x = 0;
        }
    }
    moveUp(deltaTime) {
        const movement = Utility.adjustForDeltaTime(this._velocity, deltaTime);
        const nextTopEdge = this._y - movement;
        if (nextTopEdge >= 0) {
            this._y -= movement;
        }
        else {
            // Stop at the top boundary
            this._y = 0;
        }
    }
    moveDown(deltaTime) {
        const movement = Utility.adjustForDeltaTime(this._velocity, deltaTime);
        const nextBottomEdge = this._y + this.h + movement;
        if (nextBottomEdge <= Canvas.HEIGHT) {
            this._y += movement;
        }
        else {
            // Stop at the bottom boundary, accounting for snake's height
            this._y = Canvas.HEIGHT - this.h;
        }
    }
    collidesWith(gameObject) {
        return (this._x < gameObject.x + gameObject.w &&
            this._x + this._width > gameObject.x &&
            this._y < gameObject.y + gameObject.h &&
            this._y + this.h > gameObject.y);
    }
    checkWallCollision() {
        return (this._x <= 0 ||
            this._x + this._width >= Canvas.WIDTH ||
            this._y <= 0 ||
            this._y + this.h >= Canvas.HEIGHT);
    }
    checkSnakeCollision(otherSnake) {
        return this.collidesWith(otherSnake);
    }
    get id() {
        return this._id;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
}
export { Snake };
//# sourceMappingURL=snake.js.map