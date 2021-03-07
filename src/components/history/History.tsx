import * as React from 'react';
import { DisplayMode } from '../setting/setting-service';
import { IGameResult } from '../game/game-service';
import './History.css';
import { Table } from 'react-bootstrap';

export interface IHistoryProps {
}

export interface IHistoryState {
  visible: DisplayMode,
  historyGames: IGameResult[]
}

export default class History extends React.Component<IHistoryProps, IHistoryState> {
  constructor(props: IHistoryProps) {
    super(props);

    this.state = {
      visible: DisplayMode.Hide,
      historyGames: [],
    }

    this._handleChangeVisible = this._handleChangeVisible.bind(this);
  }

  private _handleChangeVisible() {
    if (this.state.visible === DisplayMode.Hide) {
      const results: IGameResult[] = JSON.parse(localStorage.getItem('SapperGameResult') ?? '[]');
      
      this.setState({historyGames: results});
      this.setState({visible: DisplayMode.Show});      
    } else {
      this.setState({visible: DisplayMode.Hide});
    }
  }

  public render() {
    const visible = this.state.visible;
    const results = this.state.historyGames;

    return (
      <div className="game-history" data-visible={visible}>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Start time</th>
              <th>Time</th>
              <th>Result</th>
              <th>Width</th>
              <th>Height</th>
              <th>Bombs</th>
            </tr>
          </thead>
          <tbody>
            {results.map((game, index) => {
              return (
                <tr key={index}>
                  <td>{new Date(game._startTime).toUTCString()}</td>
                  <td>{new Date(game._timeGame - (3 * 60 * 60 * 1000)).toLocaleTimeString('it-IT')}</td>
                  <td>{game._result}</td>
                  <td>{game._fieldWidth}</td>
                  <td>{game._fieldHeight}</td>
                  <td>{game._countBombs}</td>
                </tr>
              );              
            })}
          </tbody>
        </Table>
        <span className="game-history__button" onClick={this._handleChangeVisible}>H</span>
      </div>
    );
  }
}
