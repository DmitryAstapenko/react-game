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
  private _fieldWidth: number;
  private _fieldHeight: number;
  private _countBombs: number;
  private _countFlags: number;
  private _cells: ICell[][];
  private _bombCoordinates: ICoordinates[];
  private _mode: GameMode;
  private _result: GameResult;
  private _startTime: Date | undefined;
  private _endTime: Date | undefined;

  constructor(width: number, height: number, _countBombs: number) {
    this._fieldWidth = width;
    this._fieldHeight = height;
    this._countBombs = _countBombs;
    this._countFlags = 0;
    this._cells = GameService._createEmptyCells(width, height);
    this._bombCoordinates = GameService._getCoordinatesBombs(width, height, _countBombs);
    this._mode = GameMode.Pause;
    this._result = GameResult.Undefined;    

    this._setBombsOnField();
    this._placeNumbersOnField();
  }

  public get fieldWidth(): number {
    return this._fieldWidth;
  }

  public get fieldHeight(): number {
    return this._fieldHeight;
  }

  public get cells(): ICell[][] {
    return this._cells;
  }

  public get mode(): GameMode {
    return this._mode;
  }

  public get result(): GameResult {
    return this._result;
  }

  public checkCell(coordinates: ICoordinates) {
    const cell = this._cells[coordinates.y][coordinates.x];

    if (this._mode === GameMode.Pause) this._startGame();
    if (cell.mode === ModeCell.Mark) return;

    if (cell.value === BOMB) {
      this._openCellsWithBombs();      
      this._endGame(GameResult.Failure);
    } else if(cell.value === 0) {
      this._openEmptyCells(coordinates);
    } else {
      this._openCell(coordinates);      
    }    

    if (this._mode === GameMode.Play && this._checkGame()) this._endGame(GameResult.Success);
  }

  public markCell(coordinates: ICoordinates) {
    const cell = this._cells[coordinates.y][coordinates.x];

    if (cell.mode !== ModeCell.Open) {
      if (cell.mode === ModeCell.Close) {
        cell.mode = ModeCell.Mark;
        this._countFlags += 1;
      } else if (cell.mode === ModeCell.Mark) {
        cell.mode = ModeCell.Close;
        this._countFlags -= 1;
      }
    }
  }

  private _startGame() {
    this._mode = GameMode.Play;
    this._startTime = new Date();
  }

  private _endGame(result: GameResult) {
    this._mode = GameMode.End;
    this._result = result;
    this._endTime = new Date();
  }

  private _checkGame(): boolean {
    for (let i = 0; i < this._cells.length; i++) {
      for (let j = 0; j < this._cells[i].length; j++) {
        const cell = this._cells[i][j];

        if ((cell.mode === ModeCell.Mark 
          || cell.mode === ModeCell.Close) 
          && cell.value !== BOMB) return false;
      }
    }

    return true;
  }

  private _openCell(coordinates: ICoordinates) {
    const cell = this._cells[coordinates.y][coordinates.x];

    if (cell.mode !== ModeCell.Mark) cell.mode = ModeCell.Open;
  }

  private _openEmptyCells(coordinates: ICoordinates) {
    const cell = this._cells[coordinates.y][coordinates.x];

    this._openCell(coordinates);

    if (cell.value === 0) {
      this._getNeighboringCells(coordinates).forEach((cell) => {
        if (cell.mode !== ModeCell.Open && cell.mode !== ModeCell.Mark)
          this._openEmptyCells(cell.coordinates);
      });
    }
  }

  private _openCellsWithBombs() {
    this._bombCoordinates.forEach((coordinates) =>
      this._cells[coordinates.x][coordinates.y].mode = ModeCell.Open);
  }

  private _setBombsOnField() {
    this._bombCoordinates.forEach((coordinates) =>
      this._cells[coordinates.x][coordinates.y].value = BOMB);
  }

  private _placeNumbersOnField() {
    for (let i = 0; i < this._cells.length; i++) {
      for (let j = 0; j < this._cells[i].length; j++) {
        if (this._cells[i][j].value !== BOMB) {
          this._cells[i][j].value = this._countBombsAroundCell(this._cells[i][j].coordinates);
        }
      }
    }
  }

  private _countBombsAroundCell(coordinates: ICoordinates): ValueCell {
    let count: number = 0;

    this._getNeighboringCells(coordinates).forEach((cell) => {
      if (cell.value === BOMB) count += 1;
    });

    return count;
  }

  private _getNeighboringCells(coordinates: ICoordinates): ICell[] {
    let neighboringCells: ICell[] = [];

    if (this._cells[coordinates.y - 1] && this._cells[coordinates.y - 1][coordinates.x])
       neighboringCells.push(this._cells[coordinates.y - 1][coordinates.x]);
    if (this._cells[coordinates.y + 1] && this._cells[coordinates.y + 1][coordinates.x])
       neighboringCells.push(this._cells[coordinates.y + 1][coordinates.x]);
    if (this._cells[coordinates.y] && this._cells[coordinates.y][coordinates.x - 1])
       neighboringCells.push(this._cells[coordinates.y][coordinates.x - 1]);
    if (this._cells[coordinates.y] && this._cells[coordinates.y][coordinates.x + 1])
       neighboringCells.push(this._cells[coordinates.y][coordinates.x + 1]);
    if (this._cells[coordinates.y + 1] && this._cells[coordinates.y + 1][coordinates.x + 1])
       neighboringCells.push(this._cells[coordinates.y + 1][coordinates.x + 1]);
    if (this._cells[coordinates.y + 1] && this._cells[coordinates.y + 1][coordinates.x - 1])
       neighboringCells.push(this._cells[coordinates.y + 1][coordinates.x - 1]);
    if (this._cells[coordinates.y - 1] && this._cells[coordinates.y - 1][coordinates.x + 1])
       neighboringCells.push(this._cells[coordinates.y - 1][coordinates.x + 1]);
    if (this._cells[coordinates.y - 1] && this._cells[coordinates.y - 1][coordinates.x - 1])
       neighboringCells.push(this._cells[coordinates.y - 1][coordinates.x - 1]);

    return neighboringCells;
  }

  private static _createEmptyCells(width: number, height: number): ICell[][] {
    let _cells: ICell[][] = [];

    for (let i = 0; i < height; i++) {
      let row: ICell[] = [];

      for (let j = 0; j < width; j++) {
        row.push({
          mode: ModeCell.Close,
          coordinates: {x: j, y: i},
          value: 0,
        });
      }

      _cells.push(row);
    }

    return _cells;
  }

  private static _getCoordinatesBombs(width: number, height: number, _countBombs: number): ICoordinates[] {
    let _bombCoordinates: ICoordinates[] = [];

    for (let i = 0; i < _countBombs; i++) {
      while (true) {
        let coordinates: ICoordinates = {
          x: AppService.randomInteger(0, width),
          y: AppService.randomInteger(0, height)
        }

        if (_bombCoordinates.find((item) => item.x === coordinates.x && item.y === coordinates.y)) {
          continue;
        } else {
          _bombCoordinates.push(coordinates);
          break;
        }
      }
    }

    return _bombCoordinates;
  }
}
