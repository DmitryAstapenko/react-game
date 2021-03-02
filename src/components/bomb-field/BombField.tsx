import * as React from 'react';
import { ICell } from '../cell/cell-service';
import Cell from '../cell/Cell';
import './BombField.css';

export interface IBombFieldProps {
  cells: ICell[][],
  width: number,
  height: number,
  onClickCell: Function
}

export interface IBombFieldState {
  cells: ICell[][],
}

export default class BombField extends React.Component<IBombFieldProps, IBombFieldState> {
  constructor(props: IBombFieldProps) {
    super(props);

    this.state = {
      cells: this.props.cells
    }
  }

  public render() {
    const width = this.props.width;
    const height = this.props.height;
    const cells = this.props.cells;
    const onClickCell = this.props.onClickCell;

    return (
      <div className="bomb-field"
        style={{
          gridTemplateColumns: `repeat(${width}, 2rem)`, 
          gridTemplateRows: `repeat(${height}, 2rem)`
        }}
      >
        {cells.flat().map((item, index) => 
          <Cell key={index.toString()}
            mode={item.mode}
            coordinates={item.coordinates}
            value={item.value}
            onClick={onClickCell}/>
        )}
      </div>
    );
  }
}
