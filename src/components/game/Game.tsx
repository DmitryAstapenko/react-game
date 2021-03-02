import * as React from 'react';
import BombField from '../bomb-field/BombField';
import { GameService } from './game-service';
import { ICell, ICoordinates, ModeCell } from '../cell/cell-service';
import './Game.css';

export interface IGameProps {
}

export interface IGameState {
  cells: ICell[][],
}

export default class Game extends React.Component<IGameProps, IGameState> {
  private fieldWidth: number = 10;
  private fieldHeight: number = 10;
  private countBombs: number = 10;

  constructor(props: IGameProps) {
    super(props);

    this.state = {
      cells: GameService.createNewField(this.fieldWidth, this.fieldHeight, this.countBombs)
    }

    this.handleClickCell = this.handleClickCell.bind(this);
  }

  private handleClickCell(event: MouseEvent, coordinates: ICoordinates): void {
    event.preventDefault();

    const typeEvent = event.type;

    if (typeEvent === 'click' && this.state.cells[coordinates.y][coordinates.x].mode !== ModeCell.Mark) {
      this.changeModeCell(coordinates, ModeCell.Open);
    } else if (typeEvent === 'contextmenu' && this.state.cells[coordinates.y][coordinates.x].mode !== ModeCell.Open) {
      this.state.cells[coordinates.y][coordinates.x].mode === ModeCell.Close
        ? this.changeModeCell(coordinates, ModeCell.Mark)
        : this.changeModeCell(coordinates, ModeCell.Close);
    }
  }

  private changeModeCell(coordinates: ICoordinates, modeCell: ModeCell) {
    this.setState((state: IGameState) => {
      state.cells[coordinates.y][coordinates.x].mode = modeCell;
      return { cells: state.cells };
    });
    console.log(modeCell);
  }

  public render() {
    return (
      <div className="game">
        <BombField
          width={this.fieldWidth}
          height={this.fieldHeight}
          cells={this.state.cells}
          onClickCell={this.handleClickCell}
        />
      </div>
    );
  }
}
