import { Tile } from "./tile";

export class Cell {
  private _cell: HTMLElement;
  private _x: number;
  private _y: number;
  private _tile: Tile | null = null;
  private _mergeTile: Tile | null = null;

  constructor(cellElement: HTMLElement, x: number, y: number) {
    this._cell = cellElement;
    this._x = x;
    this._y = y;
  }

  get cell() {
    return this._cell;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get tile(): Tile | null {
    return this._tile;
  }

  set tile(value: Tile | null) {
    this._tile = value;

    if (value === null) {
      return;
    }
    (this._tile as Tile).x = this._x;
    (this._tile as Tile).y = this._y;
  }

  get mergeTile(): Tile | null {
    return this._mergeTile;
  }

  set mergeTile(incoming: Tile | null) {
    this._mergeTile = incoming;

    if (incoming === null) {
      return;
    }
    (this._mergeTile as Tile).x = this.x;
    (this._mergeTile as Tile).y = this.y;
  }

  canAccept(incoming: Tile | null): boolean {
    return this._tile === null || (this._mergeTile === null && this._tile.value === incoming?.value);
  }

  mergeTiles(): number {
    // We can only attempt to merge if we have something to merge with
    if (this.tile === null || this.mergeTile === null) {
      return 0;
    }
    const old = this.tile.value;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;

    return old * 2 + (old === 2 ? 0 : old);
  }
}

export default { Cell };
