//@ts-ignore Import module
import { FirebaseClient } from "./firebaseClient.js";
import { Canvas } from './canvas.js';
import { Snake } from './snake.js';
import { Controller } from './controller.js';
import { MoveLeftCommand, MoveDownCommand, MoveRightCommand, MoveUpCommand } from './command.js';
import { Background } from './background.js';
import { Apple } from './apple.js';
// import { Characters } from "./snake.js";
import { onDisconnect, ref, onValue,
//@ts-ignore Import module
 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
class Game {
    canvasElement = document.getElementById("gameScreen");
    backgroundImage = document.getElementById("gameBackground");
    snakeBodyImage = document.getElementById("snakeBody");
    appleImage = document.getElementById("apple");
    prevTime = 0;
    FPS = 60;
    timeBetweenFrames = 1000 / this.FPS;
    snakeWidth = 50;
    snakeHeight = 50;
    charactersObject = {};
    appleObject = {};
    appleArray = [];
    static _instance;
    canvas = new Canvas();
    snake = new Snake((Canvas.WIDTH - this.snakeWidth) / 2, (Canvas.HEIGHT - this.snakeHeight) / 2, this.snakeWidth, this.snakeWidth, this.snakeBodyImage);
    controller = new Controller(new MoveUpCommand(this.snake), new MoveLeftCommand(this.snake), new MoveDownCommand(this.snake), new MoveRightCommand(this.snake));
    background = new Background(0, 0, Canvas.WIDTH, Canvas.HEIGHT, this.backgroundImage);
    isGameOver = false;
    isGameStarted = false;
    constructor() {
        this.showStartPage();
        document.addEventListener('keydown', (event) => this.startGame(event));
    }
    showStartPage() {
        this.canvas.context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        this.canvas.context.fillStyle = "black";
        this.canvas.context.font = "24px serif";
        this.canvas.context.fillText("Press WASD to control the player", Canvas.WIDTH / 2 - 150, Canvas.HEIGHT / 2 - 20);
        this.canvas.context.fillText("Press Enter to start the game", Canvas.WIDTH / 2 - 150, Canvas.HEIGHT / 2 + 20);
    }
    startGame(e) {
        if (e.key === 'Enter' && !this.isGameStarted) {
            this.isGameStarted = true;
            setInterval(() => {
                this.instantiate();
            }, this.timeBetweenFrames);
            this.initializeApples();
            onDisconnect(ref(FirebaseClient.instance.db, `/players/${this.snake._id}`)).set(null);
        }
    }
    initializeApples(count = 10) {
        this.appleArray = [];
        for (let i = 0; i < count; i++) {
            this.appleArray.push(new Apple(this.appleImage, i, 50, 50));
        }
    }
    instantiate() {
        if (this.isGameStarted || this.isGameOver) {
            requestAnimationFrame((time) => this.handleNextFrame(time));
        }
    }
    update(deltaTime) {
        if (this.isGameOver || !this.isGameStarted)
            return;
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
            const otherSnake = new Snake(this.charactersObject[id].x, this.charactersObject[id].y, this.snakeWidth, this.snakeHeight, this.snakeBodyImage);
            if (this.snake.checkSnakeCollision(otherSnake)) {
                console.log("Snake collision detected");
                this.gameOver();
                return;
            }
        }
        // grab apple info (id, x, y) from the database and save it locally to my game
        onValue(ref(FirebaseClient.instance.db, "/apples"), (snapshot) => {
            if (snapshot.val()) {
                this.appleObject = snapshot.val();
            }
        }, { onlyOnce: true });
        //Grab snake info (id, x, y) from the database and save it locally to my game
        onValue(ref(FirebaseClient.instance.db, "/players"), (snapshot) => {
            if (snapshot.val()) {
                this.charactersObject = snapshot.val();
                //Remove the player, but keep all the other users
                delete this.charactersObject[this.snake.id];
                // Update the snake's width from Firebase
                if (this.charactersObject[this.snake.id]) {
                    this.snake.width = this.charactersObject[this.snake.id].width;
                }
            }
        }, { onlyOnce: true });
        // Check for collisions between the snake and apples
        this.appleArray.forEach(apple => {
            apple.checkCollision(this.snake, this.canvas.context);
        });
    }
    draw() {
        if (!this.isGameStarted || this.isGameOver)
            return;
        this.canvas.context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT); // Clear the canvas
        this.background.draw(this.canvas.context);
        this.snake.draw(this.canvas.context);
        for (let id in this.charactersObject) {
            new Snake(this.charactersObject[id].x, this.charactersObject[id].y, this.snakeWidth, this.snakeHeight, this.snakeBodyImage).draw(this.canvas.context);
        }
        this.appleArray.forEach(apple => {
            apple.drawApple(this.canvas.context, this.appleObject[apple.id].x, this.appleObject[apple.id].y);
        });
    }
    handleNextFrame(time) {
        if (this.isGameOver || !this.isGameStarted)
            return; // Stop the game loop if the game is over
        const deltaTime = time - this.prevTime;
        if (deltaTime > this.timeBetweenFrames - 0.2) {
            this.update(deltaTime);
            this.draw();
            this.prevTime = time;
        }
        requestAnimationFrame((time) => this.handleNextFrame(time));
    }
    gameOver() {
        console.log("Game Over triggered");
        this.isGameOver = true;
        this.canvas.context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        this.canvas.context.fillStyle = "black";
        this.canvas.context.font = "48px serif";
        this.canvas.context.fillText("Game Over", Canvas.WIDTH / 2 - 100, Canvas.HEIGHT / 2);
    }
    static get instance() {
        if (!Game._instance)
            Game._instance = new Game();
        return Game._instance;
    }
}
class Driver {
    constructor() {
        Game.instance;
    }
}
new Driver();
//# sourceMappingURL=index.js.map