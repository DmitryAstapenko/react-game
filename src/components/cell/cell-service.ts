export enum ModeCell {
  Open = 'OPEN',
  Close = 'CLOSE',
  Check = 'CHECK'
}

export interface ICoordinates {
  x: number,
  y: number
}

export interface ICell {
  mode: ModeCell,
  coordinates: ICoordinates,
  value: '' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | '#'
}