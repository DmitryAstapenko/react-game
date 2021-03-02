import { ICell, ModeCell, ICoordinates, ValueCell, BOMB } from '../cell/cell-service';
import { AppService } from '../../app-service';

export class GameService {
  private static cells: ICell[][];

  public static createNewField(width: number, height: number, countBombs: number): ICell[][] {
    GameService.cells = GameService.createEmptyCells(width, height);
    const bombCoordinates: ICoordinates[] = GameService.getCoordinatesBombs(width, height, countBombs);

    bombCoordinates.forEach((coordinates) => GameService.cells[coordinates.x][coordinates.y].value = BOMB);
    GameService.placeNumbersOnField();

    return GameService.cells;
  }

  private static createEmptyCells(width: number, height: number): ICell[][] {
    let cells: ICell[][] = [];

    for (let i = 0; i < height; i++) {
      let row: ICell[] = [];

      for (let j = 0; j < width; j++) {
        row.push({
          mode: ModeCell.Close,
          coordinates: {x: j, y: i},
          value: 0,
        });
      }

      cells.push(row);
    }

    return cells;
  }

  private static getCoordinatesBombs(width: number, height: number, countBombs: number): ICoordinates[] {
    let bombCoordinates: ICoordinates[] = [];

    for (let i = 0; i < countBombs; i++) {
      while (true) {
        let coordinates: ICoordinates = {
          x: AppService.randomInteger(0, width),
          y: AppService.randomInteger(0, height)
        }

        if (bombCoordinates.find((item) => item.x === coordinates.x && item.y === coordinates.y)) {
          continue;
        } else {
          bombCoordinates.push(coordinates);
          break;
        }
      }
    }

    return bombCoordinates;
  }

  private static placeNumbersOnField() {
    for (let i = 0; i < GameService.cells.length; i++) {
      for (let j = 0; j < GameService.cells[i].length; j++) {
        if (GameService.cells[i][j].value !== BOMB) {
          GameService.cells[i][j].value = GameService.countBombs(GameService.cells[i][j].coordinates)
        }
      }
    }
  }

  private static countBombs(coordinates: ICoordinates): ValueCell {
    let count: number = 0;

    if (GameService.cells[coordinates.y - 1] && 
      GameService.cells[coordinates.y - 1][coordinates.x]?.value === BOMB) count += 1;
    if (GameService.cells[coordinates.y + 1] && 
      GameService.cells[coordinates.y + 1][coordinates.x]?.value === BOMB) count += 1;
    if (GameService.cells[coordinates.y] && 
      GameService.cells[coordinates.y][coordinates.x - 1]?.value === BOMB) count += 1;
    if (GameService.cells[coordinates.y] && 
      GameService.cells[coordinates.y][coordinates.x + 1]?.value === BOMB) count += 1;
    if (GameService.cells[coordinates.y + 1] && 
      GameService.cells[coordinates.y + 1][coordinates.x + 1]?.value === BOMB) count += 1;
    if (GameService.cells[coordinates.y + 1] && 
      GameService.cells[coordinates.y + 1][coordinates.x - 1]?.value === BOMB) count += 1;
    if (GameService.cells[coordinates.y - 1] && 
      GameService.cells[coordinates.y - 1][coordinates.x + 1]?.value === BOMB) count += 1;
    if (GameService.cells[coordinates.y - 1] && 
      GameService.cells[coordinates.y - 1][coordinates.x - 1]?.value === BOMB) count += 1;

    return count;
  }
}
