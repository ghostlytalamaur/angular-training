export interface Point {
  x: number;
  y: number;
}

export interface DialogInterface {
  getPosition(): Point;
  setPosition(pos: Point): void;
  resetPosition(): void;
  setZIndex(zIndex: number): void;
  disableDrag(): void;
  enableDrag(): void;
  setMaximized(isMaximized: boolean): void;
  getMaximized(): boolean;
}
