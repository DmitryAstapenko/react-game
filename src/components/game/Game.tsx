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

  private handleClickCell(coordinates: ICoordinates): void {    
    this.openCell(coordinates);    
  }

  private openCell(coordinates: ICoordinates) {
    this.setState((state: IGameState) => {      
      state.cells[coordinates.y][coordinates.x].mode = ModeCell.Open;
      return { cells: state.cells };
    });
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
