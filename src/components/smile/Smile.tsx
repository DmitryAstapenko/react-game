import * as React from 'react';
import 'Smile.css';

export interface ISmileProps {
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
    return (
      <div className="smile">
        
      </div>
    );
  }
}
