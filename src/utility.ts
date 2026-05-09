abstract class Utility {
  public static adjustForDeltaTime(value: number, deltaTime: number): number {
    return value * (deltaTime /1000);
  }
}

export { Utility };