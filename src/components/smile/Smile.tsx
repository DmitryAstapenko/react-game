import * as React from 'react';
import { GameResult } from '../game/game-service';
import { SMILE, SMILE_HAPPY, SMILE_SAD } from './smile-service';
import '../smile/Smile.css';

export interface ISmileProps {
  result: GameResult,
  onClickSmile: Function
}

export interface ISmileState {
}

export default class Smile extends React.Component<ISmileProps, ISmileState> {
  constructor(props: ISmileProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    const onClickSmile = this.props.onClickSmile;
    let smile: string;

    if (this.props.result === GameResult.Success) {
      smile = SMILE_HAPPY;  
    } else if (this.props.result === GameResult.Failure) {
      smile = SMILE_SAD;  
    } else {
      smile = SMILE;  
    }        

    return (
      <div className="game-smile">
        <span className="game-smile__result" onClick={() => onClickSmile()}>{smile}</span>
      </div>
    );
  }
}
