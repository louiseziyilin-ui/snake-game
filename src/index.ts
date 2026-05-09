//@ts-ignore Import module
import { FirebaseClient } from "./firebaseClient.js";
import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { Controller } from './controller.js';
import {
  MoveLeftCommand,
  MoveDownCommand,
  MoveRightCommand,
  MoveUpCommand
} from './command.js';
import { Background } from './background.js';
import { Apple } from './apple.js';
// import { Characters } from "./snake.js";
import {
  set,
  onDisconnect,
  ref,
  onValue,
  //@ts-ignore Import module
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


class Game {
  private canvasElement = document.getElementById("gameScreen") as HTMLCanvasElement;
  private backgroundImage = document.getElementById("gameBackground") as HTMLImageElement;
  private snakeBodyImage = document.getElementById("snakeBody") as HTMLImageElement;
  private appleImage = document.getElementById("apple") as HTMLImageElement;

  private prevTime: number = 0;
  private FPS: number = 60;
  private timeBetweenFrames: number = 1000 / this.FPS;
  private snakeWidth: number = 50;
  private snakeHeight: number = 50;
  private charactersObject = {};
  private appleObject = {};
  private appleArray: Apple[] = [];

  private static _instance: Game;
  private canvas: Canvas = new Canvas();
  private snake: Snake = new Snake(
    (Canvas.WIDTH - this.snakeWidth) / 2,
    (Canvas.HEIGHT - this.snakeHeight) / 2,
    this.snakeWidth,
    this.snakeWidth,
    this.snakeBodyImage
  );
  private controller: Controller = new Controller(
    new MoveUpCommand(this.snake),
    new MoveLeftCommand(this.snake),
    new MoveDownCommand(this.snake),
    new MoveRightCommand(this.snake)
  );
  private background: Background = new Background(
    0,
    0,
    Canvas.WIDTH,
    Canvas.HEIGHT,
    this.backgroundImage
  );
  private isGameOver: boolean = false;
  private isGameStarted: boolean = false;

  constructor() {
    this.showStartPage();
    document.addEventListener('keydown', (event) => this.startGame(event));
  }

  private showStartPage(): void {
    this.canvas.context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
    this.canvas.context.fillStyle = "black";
    this.canvas.context.font = "24px serif";
    this.canvas.context.fillText(
      "Press WASD to control the player", 
      Canvas.WIDTH / 2 - 150, 
      Canvas.HEIGHT / 2 - 20
    );
    this.canvas.context.fillText(
      "Press Enter to start the game", 
      Canvas.WIDTH / 2 - 150, 
      Canvas.HEIGHT / 2 + 20
    );
  }

  private startGame(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !this.isGameStarted) {
      this.isGameStarted = true;
      setInterval(() => {
        this.instantiate();
      }, this.timeBetweenFrames);
      this.initializeApples();
      onDisconnect(
        ref(FirebaseClient.instance.db, `/players/${this.snake._id}`)
      ).set(null);
    }
  }

  private initializeApples(count: number = 10): void {
    this.appleArray = [];
    for(let i = 0; i < count; i++) {
        this.appleArray.push(new Apple(this.appleImage, i, 50, 50));
    }
  }

  private instantiate(): void {
    if (this.isGameStarted|| this.isGameOver) {
      requestAnimationFrame((time) => this.handleNextFrame(time));
    }
  }

  private update(deltaTime: number): void {
    if (this.isGameOver || !this.isGameStarted) return;

    this.canvas.updateCanvasSize();
    this.controller.keyPressHandler(deltaTime);

    // Check for wall collision
    if (this.snake.checkWallCollision()) {
      console.log("Wall collision detected");
      this.gameOver();
      return;
    }

    // Check for collisions with other snakes
    for (let id in this.charactersObject) {
      const otherSnake = new Snake(
        this.charactersObject[id].x,
        this.charactersObject[id].y,
        this.snakeWidth,
        this.snakeHeight,
        this.snakeBodyImage
      );
      if (this.snake.checkSnakeCollision(otherSnake)) {
        console.log("Snake collision detected");
        this.gameOver();
        return;
      }
    }
    
    // grab apple info (id, x, y) from the database and save it locally to my game
    onValue(
      ref(FirebaseClient.instance.db, "/apples"),
      (snapshot) => {
        if (snapshot.val()) {
          this.appleObject = snapshot.val();
        }
      },
      { onlyOnce: true }
    );

    //Grab snake info (id, x, y) from the database and save it locally to my game
    onValue(
      ref(FirebaseClient.instance.db, "/players"),
      (snapshot) => {
        if (snapshot.val()) {
          this.charactersObject = snapshot.val();

          //Remove the player, but keep all the other users
          delete this.charactersObject[this.snake.id];

          // Update the snake's width from Firebase
          if (this.charactersObject[this.snake.id]) {
            this.snake.width = this.charactersObject[this.snake.id].width;
          }
        }
      },
      { onlyOnce: true }
    );

    // Check for collisions between the snake and apples
    this.appleArray.forEach(apple => {
      apple.checkCollision(this.snake, this.canvas.context);
    });
  }

  private draw(): void {
    if (!this.isGameStarted || this.isGameOver) return;
    this.canvas.context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT); // Clear the canvas
    this.background.draw(this.canvas.context);
    this.snake.draw(this.canvas.context);

    for (let id in this.charactersObject) {
      new Snake(
        this.charactersObject[id].x,
        this.charactersObject[id].y,
        this.snakeWidth,
        this.snakeHeight,
        this.snakeBodyImage
      ).draw(this.canvas.context);
    }

    this.appleArray.forEach(apple => {
      apple.drawApple(this.canvas.context, this.appleObject[apple.id].x, this.appleObject[apple.id].y);
    });

  }

  private handleNextFrame(time: number): void {
    if (this.isGameOver || !this.isGameStarted) return; // Stop the game loop if the game is over

    const deltaTime = time - this.prevTime;
    if (deltaTime > this.timeBetweenFrames - 0.2) {
      this.update(deltaTime);
      this.draw();
      this.prevTime = time;
    }
    requestAnimationFrame((time) => this.handleNextFrame(time));
  }

  private gameOver(): void {
    console.log("Game Over triggered");
    this.isGameOver = true;

    this.canvas.context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);

    this.canvas.context.fillStyle = "black";
    this.canvas.context.font = "48px serif";
    this.canvas.context.fillText("Game Over", Canvas.WIDTH / 2 - 100, Canvas.HEIGHT / 2);
  }

  public static get instance(): Game {
    if (!Game._instance) Game._instance = new Game();
    return Game._instance;
  }
}

class Driver {
  constructor() {
    Game.instance;
  }
}

new Driver();