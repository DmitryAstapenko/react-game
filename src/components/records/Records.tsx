import * as React from 'react';
import { Table } from 'react-bootstrap';
import { GameResult, IGameResult } from '../game/game-service';
import { DisplayMode } from '../setting/setting-service';
import './Records.css';

const KeyboardEventHandler = require('react-keyboard-event-handler');

export interface IRecordsProps {
}

export interface IRecordsState {
  visible: DisplayMode,
  recordsGames: IGameResult[]
}

export default class Records extends React.Component<IRecordsProps, IRecordsState> {
  constructor(props: IRecordsProps) {
    super(props);

    this.state = {
      visible: DisplayMode.Hide,
      recordsGames: [],
    }

    this._handleChangeVisible = this._handleChangeVisible.bind(this);
  }

  private _handleChangeVisible() {
    if (this.state.visible === DisplayMode.Hide) {
      let records: IGameResult[] = JSON.parse(localStorage.getItem('SapperGameResult') ?? '[]');

      records = records
        .filter(record => record._result === GameResult.Success)
        .sort((a, b) => a._timeGame - b._timeGame)
        .slice(0, 10);
      
      this.setState({recordsGames: records});
      this.setState({visible: DisplayMode.Show});
    } else {
      this.setState({visible: DisplayMode.Hide});
    }
  }

  public render() {
    const visible = this.state.visible;
    const records = this.state.recordsGames;

    return (
      <div className="game-records" data-visible={visible}>
        <KeyboardEventHandler
            handleKeys={['w']}
            onKeyEvent={(key: any, event: KeyboardEvent) => this._handleChangeVisible()} />
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Start time</th>
              <th>Time</th>              
              <th>Width</th>
              <th>Height</th>
              <th>Bombs</th>
            </tr>
          </thead>
          <tbody>
            {records.map((game, index) => {
              return (
                <tr key={index}>
                  <td>{new Date(game._startTime).toUTCString()}</td>
                  <td>{new Date(game._timeGame - (3 * 60 * 60 * 1000)).toLocaleTimeString('it-IT')}</td>                  
                  <td>{game._fieldWidth}</td>
                  <td>{game._fieldHeight}</td>
                  <td>{game._countBombs}</td>
                </tr>
              );              
            })}
          </tbody>
        </Table>
        <span className="game-records__button" onClick={this._handleChangeVisible}>R</span>
      </div>
    );
  }
}
