class Canvas {
    static WIDTH = window.innerWidth;
    static HEIGHT = window.innerHeight;
    _element = document.getElementById("gameScreen");
    _context = this._element.getContext("2d");
    constructor() {
        this.updateCanvasSize();
        this.addResizeListener();
    }
    updateCanvasSize() {
        Canvas.WIDTH = window.innerWidth;
        Canvas.HEIGHT = window.innerHeight;
        this._element.width = Canvas.WIDTH;
        this._element.height = Canvas.HEIGHT;
    }
    // update to a new size of screen once screen size change is detected.
    addResizeListener() {
        window.addEventListener("resize", () => {
            this.updateCanvasSize();
        });
    }
    get context() {
        return this._context;
    }
}
export { Canvas };
//# sourceMappingURL=canvas.js.map