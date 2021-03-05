import * as React from 'react';
import { GameMode } from '../game/game-service'
import './Timer.css';

export interface ITimerProps {
  startTimer: number;
  gameMode: GameMode;
}

export interface ITimerState {
  time: number
}

export default class Timer extends React.Component<ITimerProps, ITimerState> {
  private _timerID!: NodeJS.Timeout;
  private _isStartTimer: boolean;

  constructor(props: ITimerProps) {
    super(props);

    this._isStartTimer = false;

    this.state = {
      time: this.props.startTimer,
    }
  }  

  componentWillReceiveProps(nextProps: ITimerProps) {    
    if (!nextProps.startTimer) this.setState({ time: 0 });
  }  

  componentDidUpdate() {    
    if (!this._isStartTimer && this.props.gameMode === GameMode.Play) {
      this._timerID = setInterval(() => this._tick(), 1000);
      this._isStartTimer = true;
    }

    if (this.props.gameMode === GameMode.End || this.props.gameMode === GameMode.Pause) {
      clearInterval(this._timerID);
      this._isStartTimer = false;
    }
  }

  private _tick() {
    this.setState({
      time: Date.now() - this.props.startTimer - (3 * 60 * 60 * 1000)
    });
  }  

  public render() {    
    const time = this.state.time 
      ? new Date(this.state.time) 
      : new Date(0, 0);

    return (
      <div className="game-timer">
        <span className="game-timer__time">
          {time.toLocaleTimeString('it-IT')}
        </span>
      </div>
    );
  }
}
