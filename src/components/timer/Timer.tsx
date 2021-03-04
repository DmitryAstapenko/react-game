import * as React from 'react';
import './Timer.css';

export interface ITimerProps {
}

export interface ITimerState {
}

export default class Timer extends React.Component<ITimerProps, ITimerState> {
  constructor(props: ITimerProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div className="game-timer">
        
      </div>
    );
  }
}
