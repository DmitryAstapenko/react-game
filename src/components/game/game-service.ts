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

export const NULL_TIME = new Date(0).getTime();

export interface IGameService {
  _fieldWidth: number;
  _fieldHeight: number;
  _countBombs: number;
  _countFlags: number;
  _cells: ICell[][];
  _bombCoordinates: ICoordinates[];
  _mode: GameMode;
  _result: GameResult;
  _startTime: number;
  _timeGame: number;
}

export interface IGameResult {
  _fieldWidth: number;
  _fieldHeight: number;
  _countBombs: number;  
  _result: GameResult;
  _startTime: number;
  _timeGame: number;
}

export const PLAY = '►';

export class GameService {
  private _fieldWidth: number;
  private _fieldHeight: number;
  private _countBombs: number;
  private _countFlags: number;
  private _cells: ICell[][];
  private _bombCoordinates: ICoordinates[];
  private _mode: GameMode;
  private _result: GameResult;
  private _startTime: number;
  private _timeGame: number;

  constructor(width: number, height: number, countBombs: number, saveObject?: IGameService) {
    if (saveObject) {
      this._fieldWidth = saveObject._fieldWidth;
      this._fieldHeight = saveObject._fieldHeight;
      this._countBombs = saveObject._countBombs;
      this._countFlags = saveObject._countFlags;
      this._cells = saveObject._cells;
      this._bombCoordinates = saveObject._bombCoordinates;
      this._mode = saveObject._mode;
      this._result = saveObject._result;
      this._startTime = saveObject._startTime;
      this._timeGame = saveObject._timeGame;
    } else {
      this._fieldWidth =  width;
      this._fieldHeight = height;
      this._countBombs = countBombs;
      this._countFlags = 0;
      this._cells = GameService._createEmptyCells(width, height);
      this._bombCoordinates = GameService._getCoordinatesBombs(width, height, countBombs);
      this._mode = GameMode.Pause;
      this._result = GameResult.Undefined;
      this._startTime = NULL_TIME;
      this._timeGame = NULL_TIME;
    }

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

  public get countBombs(): number {
    return this._countBombs;
  }

  public get countFlags(): number {
    return this._countFlags;
  }

  public get startTime(): number {
    return this._startTime;
  }

  public get timeGame(): number {
    return this._timeGame;
  }

  public setTimeGame(value: number) {
    this._timeGame = value;
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
    if (this._mode === GameMode.Pause) this._startGame();

    const cell = this._cells[coordinates.y][coordinates.x];

    if (cell.mode !== ModeCell.Open) {
      if (cell.mode === ModeCell.Close && this._countBombs - this._countFlags > 0) {
        cell.mode = ModeCell.Mark;
        this._countFlags += 1;
      } else if (cell.mode === ModeCell.Mark) {
        cell.mode = ModeCell.Close;
        this._countFlags -= 1;
      }
    }
  }

  public repeatGame() {
    this._countFlags = 0;
    this._mode = GameMode.Pause;
    this._result = GameResult.Undefined;
    this._startTime = 0;
    this._timeGame = 0;

    this._cells.forEach((row) => row.forEach((cell) => cell.mode = ModeCell.Close));
  }

  public pauseGame() {
    this._mode = GameMode.Pause;
  }

  private _startGame() {
    this._mode = GameMode.Play;
    this._startTime = Date.now() - this._timeGame;
  }

  private _endGame(result: GameResult) {
    this._mode = GameMode.End;
    this._result = result;

    GameService._saveGameResult({
      _fieldWidth: this._fieldWidth,
      _fieldHeight: this._fieldHeight,
      _countBombs: this._countBombs,
      _result: this._result,
      _startTime: this._startTime,
      _timeGame: this._timeGame
    });
    
    this._startTime = 0;
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
      this._cells[coordinates.y][coordinates.x].mode = ModeCell.Open);
  }

  private _setBombsOnField() {
    this._bombCoordinates.forEach((coordinates) =>
      this._cells[coordinates.y][coordinates.x].value = BOMB);
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

  private static _saveGameResult(game: IGameResult) {        
    let save: IGameResult[] = JSON.parse(localStorage.getItem('SapperGameResult') ?? '[]');   
    save.push(game);
    localStorage.setItem('SapperGameResult', JSON.stringify(save));      
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
