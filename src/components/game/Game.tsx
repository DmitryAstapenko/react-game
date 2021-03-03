import * as React from 'react';
import BombField from '../bomb-field/BombField';
import { GameService } from './game-service';
import { ICoordinates } from '../cell/cell-service';
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

    return (
      <div className="game">
        <BombField
          width={width}
          height={height}
          cells={cells}
          onClickCell={this.handleClickCell}
        />
      </div>
    );
  }
}
