import * as React from 'react';
import { DisplayMode, SETTING } from './setting-service';
import './Setting.css';

export interface ISettingProps {
}

export interface ISettingState {
  visible: DisplayMode
}

export default class Setting extends React.Component<ISettingProps, ISettingState> {
  constructor(props: ISettingProps) {
    super(props);

    this.state = {
      visible: DisplayMode.Hide
    }

    this.changeVisible = this.changeVisible.bind(this);
  }

  changeVisible() {
    const visible = this.state.visible === DisplayMode.Hide
      ? DisplayMode.Show
      : DisplayMode.Hide;

    this.setState({visible: visible});
  }

  public render() {
    const visible = this.state.visible;

    return (
      <div className="game-setting" data-visible={visible}>
        <div className="game-setting__container"></div>
        <div className="game-setting__overlay"></div>
        <span className="game-setting__button-show"
          onClick={this.changeVisible}
        >{SETTING}</span>
      </div>
    );
  }
}
