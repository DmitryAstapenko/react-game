import * as React from 'react';
import { Button, ButtonGroup, Form, FormControl, InputGroup } from 'react-bootstrap';
import { PLAY } from '../game/game-service';
import { DisplayMode, SETTING } from './setting-service';
import './Setting.css';

export interface ISettingProps {
  onClickPlay: Function
}

export interface ISettingState {
  visible: DisplayMode,
  width: number,
  height: number,
  bombs: number
}

export default class Setting extends React.Component<ISettingProps, ISettingState> {
  constructor(props: ISettingProps) {
    super(props);

    this.state = {
      visible: DisplayMode.Hide,
      width: 10,
      height: 10,
      bombs: 10
    }

    this._handleChangeVisible = this._handleChangeVisible.bind(this);
    // this._handleChangeWidth = this._handleChangeWidth.bind(this);
    // this._handleChangeHeight = this._handleChangeHeight.bind(this);
    // this._handleChangeBombs = this._handleChangeBombs.bind(this);
    // this._handleClickButtonDifficulty = this._handleClickButtonDifficulty.bind(this);
  }

  private _handleChangeVisible() {
    const visible = this.state.visible === DisplayMode.Hide
      ? DisplayMode.Show
      : DisplayMode.Hide;

    this.setState({visible: visible});
  }

  private _handleClickButtonDifficulty(width: number, height: number, bombs: number) {
    this.setState({width: width});
    this.setState({height: height});
    this.setState({bombs: bombs});
  }

  private _handleChangeWidth(value: number) {
    value = value < 10 ? 10 : value;
    value = value >= 50 ? 50 : value;
    this.setState({width: value});
  }

  private _handleChangeHeight(value: number) {
    value = value < 10 ? 10 : value;
    value = value >= 50 ? 50 : value;
    this.setState({height: value});
  }

  private _handleChangeBombs(value: number) {
    const count = this.state.width * this.state.height;
    console.log(this.state.width, this.state.height);
    value = value < 10 ? 10 : value;
    value = value > count ? count : value;
    this.setState({bombs: value});
  }

  public render() {
    const visible = this.state.visible;
    const width = this.state.width;
    const height = this.state.height;
    const bombs = this.state.bombs;
    const onClickPlay = this.props.onClickPlay;

    return (
      <div className="game-setting" data-visible={visible}>
        <div className="game-setting__container">
          <h5>Game Settings</h5>
          <ButtonGroup aria-label="Basic example" size="sm">
            <Button variant="dark" onClick={() => this._handleClickButtonDifficulty(10, 10, 10)}>Low</Button>
            <Button variant="dark" onClick={() => this._handleClickButtonDifficulty(20, 20, 50)}>Normal</Button>
            <Button variant="dark" onClick={() => this._handleClickButtonDifficulty(40, 30, 200)}>Hard</Button>
          </ButtonGroup>
          <InputGroup size='sm'>
            <InputGroup.Prepend><InputGroup.Text>Width</InputGroup.Text></InputGroup.Prepend>
            <FormControl type="number"
              value={width}
              min="10"
              placeholder="enter the field width"
              onChange={(event) => this._handleChangeWidth(+event.currentTarget.value)} />
          </InputGroup>
          <InputGroup size="sm">
            <InputGroup.Prepend><InputGroup.Text>Height</InputGroup.Text></InputGroup.Prepend>
            <Form.Control type="number"
              value={height}
              min="10"
              placeholder="enter the field height"
              onChange={(event) => this._handleChangeHeight(+event.currentTarget.value)} />
          </InputGroup>
          <InputGroup size="sm">
            <InputGroup.Prepend><InputGroup.Text>Bombs</InputGroup.Text></InputGroup.Prepend>
            <Form.Control type="number"
              value={bombs}
              min="10"
              placeholder="enter the number of bombs"
              onChange={(event) => this._handleChangeBombs(+event.currentTarget.value)} />
          </InputGroup>
          <br/>
          <h5>App Settings</h5>
        </div>
        <div className="game-setting__overlay" onClick={this._handleChangeVisible}></div>
        <span className="game-setting__button-show" onClick={this._handleChangeVisible}>{SETTING}</span>
        <span className="game__button-play" onClick={() => onClickPlay(width, height, bombs)}>{PLAY}</span>
      </div>
    );
  }
}
