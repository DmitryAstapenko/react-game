import * as React from 'react';
import '../counter/Counter.css';

export interface ICounterProps {
  countMarkCells: number;
}

export interface ICounterState {
}

export default class Counter extends React.Component<ICounterProps, ICounterState> {
  constructor(props: ICounterProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    const count = this.props.countMarkCells;

    return (
      <div className="game-counter">
        <span className="game-counter__count">{count}</span>
      </div>
    );
  }
}
