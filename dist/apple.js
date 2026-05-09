import { GameObject } from './gameObject.js';
import { FirebaseClient } from './firebaseClient.js';
import { Canvas } from './canvas.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
class Apple extends GameObject {
    _isVisible = true;
    _firebaseRef;
    characters = {};
    _id;
    growth = false;
    constructor(image, id, appleWidth, appleHeight) {
        const x = Math.floor(Math.random() * (Canvas.WIDTH - appleWidth));
        const y = Math.floor(Math.random() * (Canvas.HEIGHT - appleHeight));
        super(x, y, appleWidth, appleHeight, image);
        this._id = id;
        this._firebaseRef = ref(FirebaseClient.instance.db, `/apples/${id}`);
        this.initializeLocation();
    }
    initializeLocation() {
        set(this._firebaseRef, {
            x: this._x,
            y: this._y,
            visible: true
        });
    }
    remove() {
        set(this._firebaseRef, {
            x: this._x,
            y: this._y,
            visible: false
        });
    }
    respawn() {
        const x = Math.floor(Math.random() * (Canvas.WIDTH - this.w));
        const y = Math.floor(Math.random() * (Canvas.HEIGHT - this.h));
        this._x = x;
        this._y = y;
        this._isVisible = true;
        this.initializeLocation();
    }
    drawApple(context, firebaseX, firebaseY) {
        if (this._isVisible) {
            context.drawImage(this.image, firebaseX, firebaseY, this.w, this.h);
        }
    }
    checkCollision(snake, context) {
        if (snake.collidesWith(this)) {
            this.remove();
            this.respawn();
            this.growth = true;
            snake.addSegment(); // grow the snake
        }
    }
    get id() {
        return this._id;
    }
    get isVisible() {
        return this._isVisible;
    }
}
export { Apple };
//# sourceMappingURL=apple.js.map