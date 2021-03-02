import * as React from 'react';
import { ModeCell, ValueCell, ICoordinates } from './cell-service'
import './Cell.css';

export interface ICellProps {
  mode: ModeCell,
  coordinates: ICoordinates,
  value: ValueCell
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
    const mode = this.props.mode;
    const value = this.props.value;    

    return (
      <div className="cell" data-mode={mode}>
        <span className="cell__value" data-value={value}>
          {value === 0 ? '' : value}
        </span>
      </div>
    );
  }
}
