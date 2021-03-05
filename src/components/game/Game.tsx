import * as React from 'react';
import { GameService, PLAY } from './game-service';
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
  constructor(props: IGameProps) {
    super(props);

    this.state = {
      game: new GameService(20, 20, 40)
    }

    this._handleClickCell = this._handleClickCell.bind(this);
    this._handleClickSmile = this._handleClickSmile.bind(this);
    this._handleClickPlay = this._handleClickPlay.bind(this);
  }

  private _handleClickCell(event: MouseEvent, coordinates: ICoordinates) {
    event.preventDefault();

    if (event.type === 'click') {
      this.state.game.checkCell(coordinates);
    } else if (event.type === 'contextmenu') {
      this.state.game.markCell(coordinates);
    }

    this.setState({game: this.state.game});
  }

  private _handleClickSmile() {    
    this.state.game.repeatGame();
    this.setState({game: this.state.game});
  }

  private _handleClickPlay() {
    const newGame = new GameService(20, 20, 20);
    
    this.setState({game: newGame});
  }

  public render() {
    const width = this.state.game.fieldWidth;
    const height = this.state.game.fieldHeight;
    const cells = this.state.game.cells;
    const mode = this.state.game.mode;
    const result = this.state.game.result;
    const startTime = this.state.game.startTime;
    const countMarkCells = this.state.game.countBombs - this.state.game.countFlags;

    return (
      <div className="game">
        <span className="game__button-play" onClick={this._handleClickPlay}>{PLAY}</span>
        <Setting></Setting>
        <div className="game__container">
          <div className="game__header">
            <Counter countMarkCells={countMarkCells} />
            <Smile result={result} onClickSmile={this._handleClickSmile} />
            <Timer startTimer={startTime} gameMode={mode}/>
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
