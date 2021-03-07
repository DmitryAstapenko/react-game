import * as React from 'react';
import { DisplayMode } from '../setting/setting-service';
import './Records.css';

export interface IRecordsProps {
}

export interface IRecordsState {
  visible: DisplayMode,
}

export default class Records extends React.Component<IRecordsProps, IRecordsState> {
  constructor(props: IRecordsProps) {
    super(props);

    this.state = {
      visible: DisplayMode.Hide,
    }

    this._handleChangeVisible = this._handleChangeVisible.bind(this);
  }

  private _handleChangeVisible() {
    if (this.state.visible === DisplayMode.Hide) {
      this.setState({visible: DisplayMode.Show});
    } else {
      this.setState({visible: DisplayMode.Hide});
    }
  }

  public render() {
    const visible = this.state.visible;

    return (
      <div className="game-records" data-visible={visible}>
        <span className="game-records__button" onClick={this._handleChangeVisible}>R</span>
      </div>
    );
  }
}
