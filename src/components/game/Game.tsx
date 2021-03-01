import * as React from 'react';
import BombField from '../bomb-field/BombField';
import { GameService } from './game-service';
import { ICell } from '../cell/cell-service';
import './Game.css';

export interface IGameProps {
}

export interface IGameState {  
  cells: ICell[][],  
}

export default class Game extends React.Component<IGameProps, IGameState> {
  private fieldWidth: number = 100;
  private fieldHeight: number = 100;
  private countBombs: number = 1000;

  constructor(props: IGameProps) {
    super(props);

    this.state = {      
      cells: GameService.createNewField(this.fieldWidth, this.fieldHeight, this.countBombs)
    }
  }

  public render() {
    return (
      <div className="game">
        <BombField 
          width={this.fieldWidth}
          height={this.fieldHeight}
          cells={this.state.cells}
        />
      </div>
    );
  }
}
