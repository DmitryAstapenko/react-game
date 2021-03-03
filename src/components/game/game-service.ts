import { ICell, ModeCell, ICoordinates, ValueCell, BOMB } from '../cell/cell-service';
import { AppService } from '../../app-service';

export enum GameMode {  
  Play = 'PLAY',
  Pause = 'PAUSE',
  End = 'END',
}

export enum GameResult {
  Undefined = 'UNDEFINED',
  Success = 'SUCCESS',
  Failure = 'FAILURE',
}

export class GameService {
  public readonly fieldWidth: number;
  public readonly fieldHeight: number;
  public readonly countBombs: number;
  public readonly cells: ICell[][];
  public readonly bombCoordinates: ICoordinates[];

  constructor(width: number, height: number, countBombs: number) {
    this.fieldWidth = width;
    this.fieldHeight = height;
    this.countBombs = countBombs;
    this.cells = GameService.createEmptyCells(width, height);
    this.bombCoordinates = GameService.getCoordinatesBombs(width, height, countBombs);

    this.setBombsOnField();
    this.placeNumbersOnField();
  }

  public checkCell(coordinates: ICoordinates) {
    const cell = this.cells[coordinates.y][coordinates.x];

    if (cell.mode === ModeCell.Mark) return;

    if (cell.value === BOMB) {
      this.openCellsWithBombs();
    } else if(cell.value === 0) {
      this.openEmptyCells(coordinates);
    } else {
      this.openCell(coordinates);
    }
  }

  public markCell(coordinates: ICoordinates) {
    const cell = this.cells[coordinates.y][coordinates.x];

    if (cell.mode !== ModeCell.Open) {
      if (cell.mode === ModeCell.Close) {
        cell.mode = ModeCell.Mark;
      } else {
        cell.mode = ModeCell.Close;
      }
    }
  }

  private openCell(coordinates: ICoordinates) {
    const cell = this.cells[coordinates.y][coordinates.x];

    if (cell.mode !== ModeCell.Mark) cell.mode = ModeCell.Open;
  }

  private openEmptyCells(coordinates: ICoordinates) {
    const cell = this.cells[coordinates.y][coordinates.x];

    this.openCell(coordinates);

    if (cell.value === 0) {
      this.getNeighboringCells(coordinates).forEach((cell) => {
        if (cell.mode !== ModeCell.Open && cell.mode !== ModeCell.Mark)
          this.openEmptyCells(cell.coordinates);
      });
    }
  }

  private openCellsWithBombs() {
    this.bombCoordinates.forEach((coordinates) =>
      this.cells[coordinates.x][coordinates.y].mode = ModeCell.Open);
  }

  private setBombsOnField() {
    this.bombCoordinates.forEach((coordinates) =>
      this.cells[coordinates.x][coordinates.y].value = BOMB);
  }

  private placeNumbersOnField() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        if (this.cells[i][j].value !== BOMB) {
          this.cells[i][j].value = this.countBombsAroundCell(this.cells[i][j].coordinates);
        }
      }
    }
  }

  private countBombsAroundCell(coordinates: ICoordinates): ValueCell {
    let count: number = 0;

    this.getNeighboringCells(coordinates).forEach((cell) => {
      if (cell.value === BOMB) count += 1;
    });

    return count;
  }

  private getNeighboringCells(coordinates: ICoordinates): ICell[] {
    let neighboringCells: ICell[] = [];

    if (this.cells[coordinates.y - 1] && this.cells[coordinates.y - 1][coordinates.x])
       neighboringCells.push(this.cells[coordinates.y - 1][coordinates.x]);
    if (this.cells[coordinates.y + 1] && this.cells[coordinates.y + 1][coordinates.x])
       neighboringCells.push(this.cells[coordinates.y + 1][coordinates.x]);
    if (this.cells[coordinates.y] && this.cells[coordinates.y][coordinates.x - 1])
       neighboringCells.push(this.cells[coordinates.y][coordinates.x - 1]);
    if (this.cells[coordinates.y] && this.cells[coordinates.y][coordinates.x + 1])
       neighboringCells.push(this.cells[coordinates.y][coordinates.x + 1]);
    if (this.cells[coordinates.y + 1] && this.cells[coordinates.y + 1][coordinates.x + 1])
       neighboringCells.push(this.cells[coordinates.y + 1][coordinates.x + 1]);
    if (this.cells[coordinates.y + 1] && this.cells[coordinates.y + 1][coordinates.x - 1])
       neighboringCells.push(this.cells[coordinates.y + 1][coordinates.x - 1]);
    if (this.cells[coordinates.y - 1] && this.cells[coordinates.y - 1][coordinates.x + 1])
       neighboringCells.push(this.cells[coordinates.y - 1][coordinates.x + 1]);
    if (this.cells[coordinates.y - 1] && this.cells[coordinates.y - 1][coordinates.x - 1])
       neighboringCells.push(this.cells[coordinates.y - 1][coordinates.x - 1]);

    return neighboringCells;
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
}
