import * as React from 'react';
import { ModeCell } from './cell-service'
import './Cell.css';

export interface ICellProps {
  mode: ModeCell,
  coordinates: { x:number; y: number },
  value: '' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | '#'
}

export interface ICellState {
}

export default class Cell extends React.Component<ICellProps, ICellState> {
  constructor(props: ICellProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    const value = this.props.value;

    return (
      <div className="cell">
        <span className="cell__value">{value}</span>
      </div>
    );
  }
}
