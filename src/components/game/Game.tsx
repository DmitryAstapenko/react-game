import * as React from 'react';
import { GameService } from './game-service';
import { ICoordinates } from '../cell/cell-service';
import BombField from '../bomb-field/BombField';
import Counter from '../counter/Counter';
import Smile from '../smile/Smile';
import Timer from '../timer/Timer';
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
      game: new GameService(10, 10, 10)
    }

    this.handleClickCell = this.handleClickCell.bind(this);
  }

  private handleClickCell(event: MouseEvent, coordinates: ICoordinates): void {
    event.preventDefault();

    if (event.type === 'click') {
      this.state.game.checkCell(coordinates);
    } else if (event.type === 'contextmenu') {
      this.state.game.markCell(coordinates);
    }

    this.setState({game: this.state.game});
  }

  public render() {
    const width = this.state.game.fieldWidth;
    const height = this.state.game.fieldHeight;
    const cells = this.state.game.cells;
    const mode = this.state.game.mode;
    const result = this.state.game.result;
    const countMarkCells = this.state.game.countBombs - this.state.game.countFlags;

    return (
      <div className="game">
        <Counter countMarkCells={countMarkCells} />
        <Smile result={result} />
        <Timer></Timer>
        <BombField
          width={width}
          height={height}
          cells={cells}
          mode={mode}
          onClickCell={this.handleClickCell}
        />
      </div>
    );
  }
}
