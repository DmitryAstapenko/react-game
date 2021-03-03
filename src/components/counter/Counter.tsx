import * as React from 'react';
import 'Counter.css';

export interface ICounterProps {
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
    return (
      <div className="counter">
        
      </div>
    );
  }
}
