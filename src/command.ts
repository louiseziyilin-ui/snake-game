import { FirebaseClient } from "./firebaseClient.js";
import { Snake } from "./snake.js";
import {
  update,
  ref,
  //@ts-ignore Import module
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { Apple } from "./apple.js";

interface Command {
  execute(deltaTime: number): void;
}

class MoveRightCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(deltaTime: number): void {
    this.snake.moveRight(deltaTime);
    new UpdateSnakePositionToFirebaseCommand(this.snake).execute();
  }
}

class MoveLeftCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(deltaTime: number): void {
    this.snake.moveLeft(deltaTime);
    new UpdateSnakePositionToFirebaseCommand(this.snake).execute();
  }
}

class MoveUpCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(deltaTime: number): void {
    this.snake.moveUp(deltaTime);
    new UpdateSnakePositionToFirebaseCommand(this.snake).execute();
  }
}

class MoveDownCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(deltaTime: number): void {
    this.snake.moveDown(deltaTime);
    new UpdateSnakePositionToFirebaseCommand(this.snake).execute();
  }
}

class UpdateSnakePositionToFirebaseCommand implements Command {
  constructor(private snake: Snake) {}

  public execute(): void {
    update(ref(FirebaseClient.instance.db, `/players/${this.snake.id}`), {
      x: this.snake.x,
      y: this.snake.y
    });
  }
}

class UpdateApplePositionToFirebaseCommand implements Command {
  constructor(private apple: Apple) {}

  public execute(): void {
    update(ref(FirebaseClient.instance.db, `/apple/${this.apple.id}`), {
      x: this.apple.x,
      y: this.apple.y
    });
  }
}

export {
  Command,
  MoveDownCommand,
  MoveLeftCommand,
  MoveRightCommand,
  MoveUpCommand,
  UpdateApplePositionToFirebaseCommand,
  UpdateSnakePositionToFirebaseCommand
};
