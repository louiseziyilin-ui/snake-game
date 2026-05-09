import { FirebaseClient } from "./firebaseClient.js";
import { update, ref,
//@ts-ignore Import module
 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
class MoveRightCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute(deltaTime) {
        this.snake.moveRight(deltaTime);
        new UpdateSnakePositionToFirebaseCommand(this.snake).execute();
    }
}
class MoveLeftCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute(deltaTime) {
        this.snake.moveLeft(deltaTime);
        new UpdateSnakePositionToFirebaseCommand(this.snake).execute();
    }
}
class MoveUpCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute(deltaTime) {
        this.snake.moveUp(deltaTime);
        new UpdateSnakePositionToFirebaseCommand(this.snake).execute();
    }
}
class MoveDownCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute(deltaTime) {
        this.snake.moveDown(deltaTime);
        new UpdateSnakePositionToFirebaseCommand(this.snake).execute();
    }
}
class UpdateSnakePositionToFirebaseCommand {
    snake;
    constructor(snake) {
        this.snake = snake;
    }
    execute() {
        update(ref(FirebaseClient.instance.db, `/players/${this.snake.id}`), {
            x: this.snake.x,
            y: this.snake.y
        });
    }
}
class UpdateApplePositionToFirebaseCommand {
    apple;
    constructor(apple) {
        this.apple = apple;
    }
    execute() {
        update(ref(FirebaseClient.instance.db, `/apple/${this.apple.id}`), {
            x: this.apple.x,
            y: this.apple.y
        });
    }
}
export { MoveDownCommand, MoveLeftCommand, MoveRightCommand, MoveUpCommand, UpdateApplePositionToFirebaseCommand, UpdateSnakePositionToFirebaseCommand };
//# sourceMappingURL=command.js.map