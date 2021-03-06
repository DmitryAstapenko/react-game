import * as React from 'react';
import { Button, ButtonGroup, Form, FormControl, InputGroup } from 'react-bootstrap';
import { PLAY } from '../game/game-service';
import { DisplayMode, SETTING } from './setting-service';
import './Setting.css';

export interface ISettingProps {
  onClickPlay: Function,
  onChangeVolumeSounds: Function,
  onChangeVolumeMusic: Function,
  onPlayMusic: Function,
  onPlaySounds: Function
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
    const onChangeVolumeSounds = this.props.onChangeVolumeSounds;
    const onChangeVolumeMusic = this.props.onChangeVolumeMusic;
    const onPlayMusic = this.props.onPlayMusic;
    const onPlaySounds = this.props.onPlaySounds;

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
          <Form.Group>
            <Form.Label>Music volume</Form.Label>
            <Form.Control defaultValue={0}
              onChange={(event) => onChangeVolumeMusic(+event.currentTarget.value)}
              type="range" />
          </Form.Group>
          <Form.Check defaultChecked={false}
            onChange={(event) => onPlayMusic(event.currentTarget.checked)}
            type="switch"
            id="music-switch"
            label="Music" />
          <Form.Group>
            <Form.Label>Volume of sounds</Form.Label>
            <Form.Control defaultValue={50}
              onChange={(event) => onChangeVolumeSounds(+event.currentTarget.value)}
              type="range" />
          </Form.Group>
          <Form.Check defaultChecked={true}
            onChange={(event) => onPlaySounds(event.currentTarget.checked)}
            type="switch"
            id="sounds-switch"
            label="Sounds" />
        </div>
        <div className="game-setting__overlay" onClick={this._handleChangeVisible}></div>
        <span className="game-setting__button-show" onClick={this._handleChangeVisible}>{SETTING}</span>
        <span className="game__button-play" onClick={() => onClickPlay(width, height, bombs)}>{PLAY}</span>
      </div>
    );
  }
}
