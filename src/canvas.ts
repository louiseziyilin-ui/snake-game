class Canvas {
  public static WIDTH: number = window.innerWidth;
  public static HEIGHT: number = window.innerHeight;

  private _element: HTMLCanvasElement = document.getElementById("gameScreen") as HTMLCanvasElement;
  private _context: CanvasRenderingContext2D = this._element.getContext("2d") as CanvasRenderingContext2D;

  constructor() {
    this.updateCanvasSize();
    this.addResizeListener();
  }

  public updateCanvasSize(): void {
    Canvas.WIDTH = window.innerWidth;
    Canvas.HEIGHT = window.innerHeight;
    this._element.width = Canvas.WIDTH;
    this._element.height = Canvas.HEIGHT;
  }

  // update to a new size of screen once screen size change is detected.
  private addResizeListener(): void {
    window.addEventListener("resize", () => {
      this.updateCanvasSize(); 
    });
  }

  public get context(): CanvasRenderingContext2D {
    return this._context;
  }
}

export { Canvas };