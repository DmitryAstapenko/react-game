import * as React from 'react';
import { GameService, GameResult, IGameService, GameMode } from './game-service';
import { ICoordinates } from '../cell/cell-service';
import BombField from '../bomb-field/BombField';
import Counter from '../counter/Counter';
import Smile from '../smile/Smile';
import Timer from '../timer/Timer';
import Setting from '../setting/Setting';
import './Game.css';

export interface IGameProps {
}

export interface IGameState {
  game: GameService,
}

export default class Game extends React.Component<IGameProps, IGameState> {
  private _timerID!: NodeJS.Timeout;
  private _isStartTimer: boolean;

  constructor(props: IGameProps) {
    super(props);

    this._isStartTimer = false;

    const saveGame = Game._getSaveLocalStorage();
    const game = saveGame._cells
      ? new GameService(0, 0, 0, saveGame)
      : new GameService(10, 10, 10);

    this.state = {
      game: game
    }

    // localStorage.clear();
    window.addEventListener('unload', () => {
      this.state.game.pauseGame();
      Game._saveGameLocalStorage(this.state.game)
    });

    this._handleClickCell = this._handleClickCell.bind(this);
    this._handleClickSmile = this._handleClickSmile.bind(this);
    this._handleClickPlay = this._handleClickPlay.bind(this);
  }

  componentDidUpdate() {
    if (this.state.game.mode === GameMode.End) this._closeTimer();
  }

  private _handleClickCell(event: MouseEvent, coordinates: ICoordinates) {
    event.preventDefault();

    if (!this._isStartTimer) this._startTimer();

    if (event.type === 'click') {
      this.state.game.checkCell(coordinates);
    } else if (event.type === 'contextmenu') {
      this.state.game.markCell(coordinates);
    }

    this.setState({game: this.state.game});
  }

  private _handleClickSmile() {
    this.state.game.repeatGame();

    if (this._isStartTimer) this._closeTimer();

    this.setState({game: this.state.game});
  }

  private _handleClickPlay(width: number, height: number, bomb: number) {
    const newGame = new GameService(width, height, bomb);

    if (this._isStartTimer) this._closeTimer();

    this.setState({game: newGame});
  }

  private _startTimer() {
    this._timerID = setInterval(() => {
      this.state.game.setTimeGame(Date.now() - this.state.game.startTime);
      this.setState({game: this.state.game});
    }, 1000);
    this._isStartTimer = true;
  }

  private _closeTimer() {
    clearInterval(this._timerID);
    this._isStartTimer = false;
  }

  private static _saveGameLocalStorage(game: GameService) {
    const save = JSON.stringify(game);
    localStorage.setItem('SaveGameSapper', save);
  }

  private static _getSaveLocalStorage(): IGameService {
    const save = localStorage.getItem('SaveGameSapper') ?? '{}';

    return JSON.parse(save);
  }

  public render() {
    const width = this.state.game.fieldWidth;
    const height = this.state.game.fieldHeight;
    const cells = this.state.game.cells;
    const mode = this.state.game.mode;
    const result = this.state.game.result;
    const time = (new Date(this.state.game.timeGame - (3 * 60 * 60 * 1000))).toLocaleTimeString('it-IT');
    const countMarkCells = this.state.game.countBombs - this.state.game.countFlags;

    return (
      <div className="game">
        <Setting onClickPlay={this._handleClickPlay}></Setting>
        <div className="game__container">
          <div className="game__header">
            <Counter countMarkCells={countMarkCells} />
            <Smile result={result} onClickSmile={this._handleClickSmile} />
            <Timer timeGame={time}/>
          </div>
          <div className="game__overlay" data-result={result}>
            {result === GameResult.Success
              ? `you defused all bombs in: ${time}`
              : 'you exploded on the bomb'
            }
          </div>
          <BombField
            width={width}
            height={height}
            cells={cells}
            mode={mode}
            onClickCell={this._handleClickCell}
          />
        </div>
      </div>
    );
  }
}
