class Controller {
    wCommand;
    aCommand;
    sCommand;
    dCommand;
    w = false;
    a = false;
    s = false;
    d = false;
    constructor(wCommand, aCommand, sCommand, dCommand) {
        this.wCommand = wCommand;
        this.aCommand = aCommand;
        this.sCommand = sCommand;
        this.dCommand = dCommand;
        document.addEventListener("keydown", (e) => this.handleKeyDown(e));
        document.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }
    keyPressHandler(deltaTime) {
        if (this.w)
            this.wCommand.execute(deltaTime);
        if (this.a)
            this.aCommand.execute(deltaTime);
        if (this.s)
            this.sCommand.execute(deltaTime);
        if (this.d)
            this.dCommand.execute(deltaTime);
    }
    handleKeyDown(e) {
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
    handleKeyUp(e) {
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
//# sourceMappingURL=controller.js.map