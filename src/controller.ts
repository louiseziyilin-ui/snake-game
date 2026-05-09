import { Command } from "./command.js";

class Controller {
  public w: boolean = false;
  public a: boolean = false;
  public s: boolean = false;
  public d: boolean = false;
  constructor(
    private wCommand: Command,
    private aCommand: Command,
    private sCommand: Command,
    private dCommand: Command
  ) {
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  public keyPressHandler(deltaTime: number): void {
    if (this.w) this.wCommand.execute(deltaTime);
    if (this.a) this.aCommand.execute(deltaTime);
    if (this.s) this.sCommand.execute(deltaTime);
    if (this.d) this.dCommand.execute(deltaTime);
  }

  public handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "w") {
      this.w = true;
    }
    if (e.key === "a") {
      this.a = true;
    }
    if (e.key === "s") {
      this.s = true;
    }
    if (e.key === "d") {
      this.d = true;
    }
  }

  public handleKeyUp(e: KeyboardEvent): void {
    if (e.key === "w") {
      this.w = false;
    }
    if (e.key === "a") {
      this.a = false;
    }
    if (e.key === "s") {
      this.s = false;
    }
    if (e.key === "d") {
      this.d = false;
    }
  }
}

export { Controller };