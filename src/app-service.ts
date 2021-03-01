export class AppService {
  public static randomInteger(min: number, max: number): number {
    let rand = min + Math.random() * (max - min);
    return Math.floor(rand);
  }
}