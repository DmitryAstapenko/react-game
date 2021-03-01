import { ICell, ModeCell, ICoordinates } from '../cell/cell-service';
import { AppService } from '../../app-service';

export class GameService {
  public static createNewField(width: number, height: number, countBombs: number): ICell[][] {
    const cells: ICell[][] = GameService.createEmptyCells(width, height);
    const bombCoordinates: ICoordinates[] = GameService.getCoordinatesBombs(width, height, countBombs);

    bombCoordinates.forEach((coordinates) => cells[coordinates.x][coordinates.y].value = '#');

    console.log(bombCoordinates);

    return cells;
  }

  private static createEmptyCells(width: number, height: number): ICell[][] {
    let cells: ICell[][] = [];

    for (let i = 0; i < height; i++) {
      let row: ICell[] = [];

      for (let j = 0; j < width; j++) {
        row.push({
          mode: ModeCell.Close,
          coordinates: {x: j, y: i},
          value: '',
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
}
