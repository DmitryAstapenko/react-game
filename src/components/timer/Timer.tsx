import * as React from 'react';
import './Timer.css';

export interface ITimerProps {
  timeGame: string;
}

export interface ITimerState {}

export default class Timer extends React.Component<ITimerProps, ITimerState> {
  constructor(props: ITimerProps) {
    super(props);

    this.state = {}
  }

  public render() {
    const time = this.props.timeGame;

    return (
      <div className="game-timer">
        <span className="game-timer__time">{time}</span>
      </div>
    );
  }
}
