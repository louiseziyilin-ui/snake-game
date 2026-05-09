import { GameObject } from './gameObject.js';
import { FirebaseClient } from './firebaseClient.js';
import { Canvas } from './canvas.js';
import {
  ref,
  set,
  onValue
  //@ts-ignore Import module
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { Snake } from './snake.js';

class Apple extends GameObject {
  private _isVisible: boolean = true;
  private _firebaseRef: any;
  public characters: any = {};
  private _id: number;
  public growth: boolean = false;

  constructor(
    image: HTMLImageElement,
    id: number,
    appleWidth: number,
    appleHeight: number
  ) {
    const x = Math.floor(Math.random() * (Canvas.WIDTH - appleWidth));
    const y = Math.floor(Math.random() * (Canvas.HEIGHT - appleHeight));

    super(x, y, appleWidth, appleHeight, image);

    this._id = id;
    this._firebaseRef = ref(FirebaseClient.instance.db, `/apples/${id}`);
    this.initializeLocation();
  }

  public initializeLocation(): void {
    set(this._firebaseRef, {
      x: this._x,
      y: this._y,
      visible: true
    });
  }

  public remove(): void {
    set(this._firebaseRef, {
      x: this._x,
      y: this._y,
      visible: false
    });
  }

  public respawn(): void {
    const x = Math.floor(Math.random() * (Canvas.WIDTH - this.w));
    const y = Math.floor(Math.random() * (Canvas.HEIGHT - this.h));
    this._x = x;
    this._y = y;
    this._isVisible = true;
    this.initializeLocation();
  }

  public drawApple(context: CanvasRenderingContext2D, firebaseX: number, firebaseY: number): void {
    if (this._isVisible) {
      context.drawImage(this.image, firebaseX, firebaseY, this.w, this.h);
    }
  }

  public checkCollision(snake: Snake, context: CanvasRenderingContext2D): void {
    if (snake.collidesWith(this)) {
      this.remove();
      this.respawn();
      this.growth = true;
      snake.addSegment(); // grow the snake
    }
  }

  public get id(): number {
    return this._id;
  }

  public get isVisible(): boolean {
    return this._isVisible;
  }
}

export { Apple };