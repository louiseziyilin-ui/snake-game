import { GameObject } from './gameObject.js';
import { Utility } from './utility.js';
import { Canvas } from './canvas.js';
//@ts-ignore Import module
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid@3.3.4/nanoid.min.js";

class Snake extends GameObject {
  private _velocity: number = 200;
  private segmentImage: HTMLImageElement;
  public _id: string = nanoid();
  private _width: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLImageElement
  ) {
    super(x, y, width, height, image);
    this.segmentImage = image;
    this._width = width;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, this._width, this.h);
  }

  public addSegment(): void {
    // Increase the width of the snake rectangle to simulate growth
    const growth = 10;
    this._width += growth;
  }
  
  public moveRight(deltaTime: number): void {
    const movement = Utility.adjustForDeltaTime(this._velocity, deltaTime);
    const nextRightEdge = this._x + this._width + movement;
    
    if (nextRightEdge <= Canvas.WIDTH) {
      this._x += movement;
    } else {
      // Stop at the right boundary, accounting for snake's width
      this._x = Canvas.WIDTH - this._width;
    }
  }

  public moveLeft(deltaTime: number): void {
    const movement = Utility.adjustForDeltaTime(this._velocity, deltaTime);
    const nextLeftEdge = this._x - movement;
    
    if (nextLeftEdge >= 0) {
      this._x -= movement;
    } else {
      // Stop at the left boundary
      this._x = 0;
    }
  }

  public moveUp(deltaTime: number): void {
    const movement = Utility.adjustForDeltaTime(this._velocity, deltaTime);
    const nextTopEdge = this._y - movement;
    
    if (nextTopEdge >= 0) {
      this._y -= movement;
    } else {
      // Stop at the top boundary
      this._y = 0;
    }
  }

  public moveDown(deltaTime: number): void {
    const movement = Utility.adjustForDeltaTime(this._velocity, deltaTime);
    const nextBottomEdge = this._y + this.h + movement;
    
    if (nextBottomEdge <= Canvas.HEIGHT) {
      this._y += movement;
    } else {
      // Stop at the bottom boundary, accounting for snake's height
      this._y = Canvas.HEIGHT - this.h;
    }
  }


  public collidesWith(gameObject: GameObject): boolean {
    return (
      this._x < gameObject.x + gameObject.w &&
      this._x + this._width > gameObject.x &&
      this._y < gameObject.y + gameObject.h &&
      this._y + this.h > gameObject.y
    );
  }

  public checkWallCollision(): boolean {
    return (
      this._x <= 0 ||
      this._x + this._width >= Canvas.WIDTH ||
      this._y <= 0 ||
      this._y + this.h >= Canvas.HEIGHT
    );
  }

  public checkSnakeCollision(otherSnake: Snake): boolean {
    return this.collidesWith(otherSnake);
  }


  public get id(): string {
    return this._id;
  }

  public get width(): number {
    return this._width;
  }

  public set width(value: number){
    this._width = value;
  }
}

export { Snake };
