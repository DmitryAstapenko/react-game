import * as React from 'react';
import { DisplayMode } from '../setting/setting-service';
import './History.css';

export interface IHistoryProps {
}

export interface IHistoryState {
  visible: DisplayMode,
}

export default class History extends React.Component<IHistoryProps, IHistoryState> {
  constructor(props: IHistoryProps) {
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
      <div className="game-history" data-visible={visible}>
        <span className="game-history__button" onClick={this._handleChangeVisible}>H</span>
      </div>
    );
  }
}
