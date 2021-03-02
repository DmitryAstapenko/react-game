export enum ModeCell {
  Open = 'OPEN',
  Close = 'CLOSE',
  Check = 'CHECK'
}

export interface ICoordinates {
  x: number,
  y: number
}

export type ValueCell = number | '#';

export interface ICell {
  mode: ModeCell,
  coordinates: ICoordinates,
  value: ValueCell
}